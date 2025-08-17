import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {
  LoginDto,
  RegisterDto,
  AuthResponseDto,
  UserProfileDto,
  EmployeeLoginDto,
} from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { User } from '../../decorators/user.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({
    summary: '用戶註冊',
    description: '創建新的用戶帳戶',
  })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description: '註冊成功',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: '用戶已存在',
  })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({
    summary: '用戶登入',
    description: '使用電子郵件和密碼登入',
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: '登入成功',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: '電子郵件或密碼錯誤',
  })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('employee-login')
  @ApiOperation({
    summary: '員工登入',
    description: '使用員工工號登入，自動從 HR 系統撈取員工資料',
  })
  @ApiBody({ type: EmployeeLoginDto })
  @ApiResponse({
    status: 200,
    description: '員工登入成功',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: '找不到該員工',
  })
  @ApiResponse({
    status: 401,
    description: '員工帳戶未啟用',
  })
  async employeeLogin(@Body() employeeLoginDto: EmployeeLoginDto) {
    return this.authService.employeeLogin(employeeLoginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({
    summary: '獲取用戶資料',
    description: '獲取當前登入用戶的個人資料',
  })
  @ApiResponse({
    status: 200,
    description: '成功獲取用戶資料',
    type: UserProfileDto,
  })
  @ApiResponse({
    status: 401,
    description: '未授權',
  })
  async getProfile(@User() user: any) {
    // 如果是員工用戶，需要重新撈取 HR 資料
    if (user.loginType === 'employee' || user.id === 0) {
      try {
        // 重新撈取完整的員工資料
        const employeeData = await this.authService.getEmployeeProfile(
          user.emplId,
        );
        return employeeData.user; // 只回傳 user 物件，hrData 由前端 Redux 管理
      } catch (error) {
        // 如果撈取失敗，返回 JWT 中的基本資料
        return user;
      }
    }
    // 一般用戶從資料庫獲取
    return this.authService.getUserProfile(user.id);
  }
}
