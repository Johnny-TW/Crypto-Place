import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import * as bcrypt from 'bcryptjs';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  async getUserProfile(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
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
}
