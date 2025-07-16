import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {
  LoginDto,
  RegisterDto,
  AuthResponseDto,
  UserProfileDto,
} from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { Public } from './decorators/public.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
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

  @Public()
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

  @Get('profile')
  @UseGuards(JwtAuthGuard)
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
  async getProfile(@CurrentUser() user: any) {
    return this.authService.getUserProfile(user.id);
  }
}
