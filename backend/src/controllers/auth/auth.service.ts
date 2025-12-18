import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { LoginDto, RegisterDto, EmployeeLoginDto } from './dto/auth.dto';
import * as bcrypt from 'bcryptjs';
import { Role } from '@prisma/client';
import { DspHrApiService } from '../../services/api/dsp.hr.api.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import _ from 'lodash';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly dspHrApiService: DspHrApiService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, name, password } = registerDto;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('用戶已存在');
    }

    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await this.prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: Role.USER,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user,
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password: inputPassword } = loginDto;

    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
        role: true,
        isActive: true,
        createdAt: true,
        emplId: true,
        enName: true,
        chName: true,
        jobTitle: true,
        phone: true,
        office: true,
        deptId: true,
        deptDescr: true,
        supvEmplId: true,
        site: true,
        emplCategoryA: true,
        bg: true,
        fnLvl1: true,
        fnLvl2: true,
        deptRoleName: true,
        deptRoleAbbr: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('電子郵件或密碼錯誤');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('帳戶已被停用');
    }

    const isPasswordValid = await bcrypt.compare(inputPassword, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('電子郵件或密碼錯誤');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const access_token = this.jwtService.sign(payload);

    const { password, ...userWithoutPassword } = user;

    const _password = password;

    return {
      access_token,
      user: userWithoutPassword,
    };
  }

  async validateUser(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('用戶不存在');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('帳戶已被停用');
    }

    return user;
  }

  async employeeLogin(employeeLoginDto: EmployeeLoginDto) {
    const { employeeId, email: inputEmail } = employeeLoginDto;

    try {
      // 從 HR API 撈取員工資料
      const hrResponse = await this.dspHrApiService.searchEmployee({
        emplid: employeeId,
      });

      const hrData = _.first(hrResponse?.body?.List ?? []) as any;

      if (!hrData) {
        throw new NotFoundException('在 HR 系統中找不到該員工');
      }

      // 從 HR 資料中提取資訊
      const email = hrData.email_addr;
      const employeeName = hrData.name || hrData.email_addr?.split('@')?.[0];

      if (!email) {
        throw new NotFoundException('員工資料不完整，缺少電子郵件');
      }

      // 🔐 驗證 Email 是否匹配 (不區分大小寫)
      if (email.toLowerCase() !== inputEmail.toLowerCase()) {
        throw new UnauthorizedException('員工工號或 Email 不正確');
      }

      // 構建虛擬用戶物件（不存入資料庫）- 根據實際 HR API 欄位對應
      const virtualUser = {
        id: 0, // 虛擬 ID，表示非資料庫用戶
        email,
        name: employeeName,
        role: Role.USER,
        isActive: true,
        createdAt: new Date(),
        emplId: employeeId,
        enName: hrData.email_addr?.split('@')?.[0]?.replaceAll('_', ' '),
        jobTitle: hrData.jobtitle,
        phone: hrData.position_phone,
        office: hrData.location,
        deptId: hrData.deptid,
        deptDescr: null,
        supvEmplId: hrData.supervisor_id,
        site: hrData.site_id,
        emplCategoryA: hrData.empl_class,
        bg: hrData.company,
        fnLvl1: hrData.jobcode,
        fnLvl2: hrData.grade,
        deptRoleName: hrData.labor_type,
        deptRoleAbbr: hrData.supv_lvl_id,
        hireDate: hrData.hire_dt,
        salLocation: hrData.sal_location,
      };

      // 產生 JWT token（包含 HR 資料）
      const payload = {
        sub: `employee_${employeeId}`, // 特殊標識符表示員工登入
        email: virtualUser.email,
        role: virtualUser.role,
        emplId: employeeId,
        name: employeeName,
        loginType: 'employee',
      };

      const access_token = this.jwtService.sign(payload);

      return {
        access_token,
        user: virtualUser,
        hrData, // 原始 HR 資料
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }
      console.error('Employee login error:', error);
      throw new NotFoundException('無法連接到 HR 系統，請稍後再試');
    }
  }

  async getUserProfile(userId: number | string) {
    // 如果是員工用戶（虛擬用戶），直接返回錯誤或處理
    if (
      userId === 0 ||
      (typeof userId === 'string' && userId.startsWith('employee_'))
    ) {
      throw new NotFoundException('員工用戶資料請從前端 Redux store 獲取');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId as number },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
        emplId: true,
        enName: true,
        chName: true,
        jobTitle: true,
        phone: true,
        office: true,
        deptId: true,
        deptDescr: true,
        supvEmplId: true,
        site: true,
        emplCategoryA: true,
        bg: true,
        fnLvl1: true,
        fnLvl2: true,
        deptRoleName: true,
        deptRoleAbbr: true,
      },
    });

    if (!user) {
      throw new NotFoundException('用戶不存在');
    }

    return user;
  }

  async create(createAuthDto: CreateAuthDto) {
    const result = await this.dspHrApiService.searchEmployee(createAuthDto);
    const user = _.first(result?.body?.List ?? []) as any;

    if (!user) {
      throw new NotFoundException('在 DSP HR 系統中找不到該員工');
    }

    const data = {
      ...createAuthDto,
      enName: user.email_addr?.split('@')?.[0]?.replaceAll('_', ' ') ?? '',
    };

    const accessToken = this.jwtService.sign(data, {
      expiresIn: '3h',
    });

    return accessToken;
  }

  async getEmployeeProfile(employeeId: string) {
    try {
      // 從 HR API 重新撈取員工資料
      const hrResponse = await this.dspHrApiService.searchEmployee({
        emplid: employeeId,
      });

      const hrData = _.first(hrResponse?.body?.List ?? []) as any;

      if (!hrData) {
        throw new NotFoundException('在 HR 系統中找不到該員工');
      }

      // 從 HR 資料中提取資訊
      const email = hrData.email_addr;
      const employeeName = hrData.name || hrData.email_addr?.split('@')?.[0];

      // 構建完整的虛擬用戶物件 (不包含重複的 hrData)
      const virtualUser = {
        id: 0, // 虛擬 ID，表示非資料庫用戶
        email,
        name: employeeName,
        role: Role.USER,
        isActive: true,
        createdAt: new Date(),
        emplId: employeeId,
        enName: hrData.email_addr?.split('@')?.[0]?.replaceAll('_', ' '),
        jobTitle: hrData.jobtitle,
        phone: hrData.position_phone,
        office: hrData.location,
        deptId: hrData.deptid,
        deptDescr: null, // HR API 沒有部門描述欄位
        supvEmplId: hrData.supervisor_id,
        site: hrData.site_id,
        emplCategoryA: hrData.empl_class,
        bg: hrData.company,
        fnLvl1: hrData.jobcode,
        fnLvl2: hrData.grade,
        deptRoleName: hrData.labor_type,
        deptRoleAbbr: hrData.supv_lvl_id,
        hireDate: hrData.hire_dt,
        salLocation: hrData.sal_location,
        loginType: 'employee',
      };

      // 回傳包含 user 和 hrData 的物件，讓前端可以分別使用
      return {
        user: virtualUser,
        hrData: hrData,
      };
    } catch (error) {
      console.error('Get employee profile error:', error);
      throw new NotFoundException('無法獲取員工資料');
    }
  }

  async findOrCreateEmployeeUser(employeeData: {
    email: string;
    name: string;
    emplId: string;
  }) {
    // 先根據員工ID查找是否已有記錄
    let user = await this.prisma.user.findFirst({
      where: { emplId: employeeData.emplId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        emplId: true,
      },
    });

    if (user) {
      // 如果找到記錄，更新資料並返回
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: {
          email: employeeData.email,
          name: employeeData.name,
          isActive: true,
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isActive: true,
          emplId: true,
        },
      });
    } else {
      // 沒有記錄則創建新用戶
      user = await this.prisma.user.create({
        data: {
          email: employeeData.email,
          name: employeeData.name,
          password: 'employee_no_password', // 員工不需要密碼登入
          role: Role.USER,
          isActive: true,
          emplId: employeeData.emplId,
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isActive: true,
          emplId: true,
        },
      });
    }

    return user;
  }

  async findAll() {
    return `This action returns all auth`;
  }

  async azureAdLogin(azureProfile: {
    azureId: string;
    email: string;
    name: string;
  }) {
    try {
      // 查找或建立使用者
      let user = await this.prisma.user.findUnique({
        where: { email: azureProfile.email },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isActive: true,
          createdAt: true,
        },
      });

      if (!user) {
        // 首次使用 Azure AD 登入，自動建立帳號
        user = await this.prisma.user.create({
          data: {
            email: azureProfile.email,
            name: azureProfile.name,
            password: 'azure_ad_no_password', // Azure AD 用戶不需要密碼
            role: Role.USER,
            isActive: true,
          },
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            isActive: true,
            createdAt: true,
          },
        });
      } else if (!user.isActive) {
        throw new UnauthorizedException('帳戶已被停用');
      }

      // 產生 JWT token
      const payload = {
        sub: user.id,
        email: user.email,
        role: user.role,
        loginType: 'azure-ad',
        azureId: azureProfile.azureId,
      };

      const access_token = this.jwtService.sign(payload);

      return {
        access_token,
        user,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      console.error('Azure AD login error:', error);
      throw new UnauthorizedException('Azure AD 登入失敗');
    }
  }

  /**
   * Google OAuth 登入
   */
  async googleLogin(googleProfile: {
    googleId: string;
    email: string;
    name: string;
    picture?: string;
  }) {
    try {
      // 查找或建立使用者
      let user = await this.prisma.user.findUnique({
        where: { email: googleProfile.email },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isActive: true,
          createdAt: true,
        },
      });

      if (!user) {
        // 首次使用 Google 登入，自動建立帳號
        user = await this.prisma.user.create({
          data: {
            email: googleProfile.email,
            name: googleProfile.name,
            password: 'google_oauth_no_password', // Google 用戶不需要密碼
            role: Role.USER,
            isActive: true,
          },
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            isActive: true,
            createdAt: true,
          },
        });
      } else if (!user.isActive) {
        throw new UnauthorizedException('帳戶已被停用');
      }

      // 產生 JWT token
      const payload = {
        sub: user.id,
        email: user.email,
        role: user.role,
        loginType: 'google',
        googleId: googleProfile.googleId,
      };

      const access_token = this.jwtService.sign(payload);

      return {
        access_token,
        user,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      console.error('Google login error:', error);
      throw new UnauthorizedException('Google 登入失敗');
    }
  }
}
