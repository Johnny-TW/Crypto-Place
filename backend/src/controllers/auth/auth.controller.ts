import { Controller, Post, Get, Body, UseGuards, Req, Res, Query } from '@nestjs/common';
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
import { MsalService } from './services/msal.service';
import { GoogleOAuthService } from './services/google-oauth.service';
import { User } from '../../decorators/user.decorator';
import { Request, Response } from 'express';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly msalService: MsalService,
    private readonly googleOAuthService: GoogleOAuthService,
  ) {}

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
    description: '使用員工工號 + Email 登入，自動從 HR 系統撈取員工資料並驗證身份',
  })
  @ApiBody({ type: EmployeeLoginDto })
  @ApiResponse({
    status: 200,
    description: '員工登入成功',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: '找不到該員工或員工資料不完整',
  })
  @ApiResponse({
    status: 401,
    description: '員工工號或 Email 不正確',
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

  @Get('azure/login')
  @ApiOperation({
    summary: 'Azure AD 登入',
    description: '透過 Microsoft Azure AD (Entra ID) 進行單一登入 (SSO)',
  })
  @ApiResponse({
    status: 302,
    description: '重導向到 Microsoft 登入頁面',
  })
  async azureLogin(@Req() req: Request, @Res() res: Response) {
    // 使用 MSAL 產生授權 URL
    const { authUrl, state, codeVerifier } = await this.msalService.getAuthUrl();

    // 將 state 和 codeVerifier 存入 session
    (req.session as any).azureAuthState = state;
    (req.session as any).azureCodeVerifier = codeVerifier;

    console.log('🔐 Azure AD Login - Redirecting to Azure AD');
    console.log('🔐 State stored:', state);

    // 明確保存 session 後再重導向，確保 session 資料被寫入
    req.session.save((err) => {
      if (err) {
        console.error('❌ Session save error:', err);
        return res.status(500).json({ message: 'Session 儲存失敗' });
      }
      console.log('✅ Session saved successfully');
      return res.redirect(authUrl);
    });
  }

  @Get('azure/callback')
  @ApiOperation({
    summary: 'Azure AD 回調端點',
    description: 'Azure AD 登入成功後的回調處理',
  })
  @ApiResponse({
    status: 302,
    description: 'Azure AD 登入成功，重導向到前端',
  })
  async azureCallback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Query('error') error: string,
    @Query('error_description') errorDescription: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

    // 檢查 Azure AD 是否回傳錯誤
    if (error) {
      console.error('❌ Azure AD Error:', error, errorDescription);
      return res.redirect(`${frontendUrl}/login?error=${encodeURIComponent(errorDescription || error)}`);
    }

    // 從 session 取出驗證資料
    const storedState = (req.session as any).azureAuthState;
    const codeVerifier = (req.session as any).azureCodeVerifier;

    console.log('🔐 Callback - Received state:', state);
    console.log('🔐 Callback - Stored state:', storedState);

    // 驗證 state
    if (!storedState || state !== storedState) {
      console.error('❌ State mismatch!');
      return res.redirect(`${frontendUrl}/login?error=${encodeURIComponent('State 驗證失敗')}`);
    }

    if (!codeVerifier) {
      console.error('❌ No code verifier in session');
      return res.redirect(`${frontendUrl}/login?error=${encodeURIComponent('Session 已過期')}`);
    }

    try {
      // 用授權碼換取 token
      const userInfo = await this.msalService.acquireTokenByCode(code, codeVerifier);

      // 清除 session 中的臨時資料
      delete (req.session as any).azureAuthState;
      delete (req.session as any).azureCodeVerifier;

      // 呼叫 AuthService 處理登入
      const result = await this.authService.azureAdLogin({
        azureId: userInfo.azureId,
        email: userInfo.email,
        name: userInfo.name,
      });

      console.log('✅ Azure AD Login Success!');
      return res.redirect(`${frontendUrl}/auth/azure/callback?token=${result.access_token}`);
    } catch (err: any) {
      console.error('❌ Token Exchange Error:', err.message);
      return res.redirect(`${frontendUrl}/login?error=${encodeURIComponent(err.message)}`);
    }
  }

  // ==================== Google OAuth ====================

  @Get('google/login')
  @ApiOperation({
    summary: 'Google OAuth 登入',
    description: '透過 Google 帳戶進行登入',
  })
  @ApiResponse({
    status: 302,
    description: '重導向到 Google 登入頁面',
  })
  async googleLogin(@Req() req: Request, @Res() res: Response) {
    const { authUrl, state } = this.googleOAuthService.getAuthUrl();

    // 將 state 存入 session
    (req.session as any).googleAuthState = state;

    console.log('🔐 Google Login - Redirecting to Google');
    console.log('🔐 State stored:', state);

    return res.redirect(authUrl);
  }

  @Get('google/callback')
  @ApiOperation({
    summary: 'Google OAuth 回調端點',
    description: 'Google 登入成功後的回調處理',
  })
  @ApiResponse({
    status: 302,
    description: 'Google 登入成功，重導向到前端',
  })
  async googleCallback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Query('error') error: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

    // 檢查 Google 是否回傳錯誤
    if (error) {
      console.error('❌ Google OAuth Error:', error);
      return res.redirect(`${frontendUrl}/login?error=${encodeURIComponent(error)}`);
    }

    // 驗證 state
    const storedState = (req.session as any).googleAuthState;
    console.log('🔐 Google Callback - Received state:', state);
    console.log('🔐 Google Callback - Stored state:', storedState);

    if (!storedState || state !== storedState) {
      console.error('❌ State mismatch!');
      return res.redirect(`${frontendUrl}/login?error=${encodeURIComponent('State 驗證失敗')}`);
    }

    try {
      // 取得使用者資訊
      const userInfo = await this.googleOAuthService.getUserInfo(code);

      // 清除 session 中的臨時資料
      delete (req.session as any).googleAuthState;

      // 呼叫 AuthService 處理 Google 登入
      const result = await this.authService.googleLogin({
        googleId: userInfo.googleId,
        email: userInfo.email,
        name: userInfo.name,
        picture: userInfo.picture,
      });

      console.log('✅ Google Login Success!');
      return res.redirect(`${frontendUrl}/auth/google/callback?token=${result.access_token}`);
    } catch (err: any) {
      console.error('❌ Google Login Error:', err.message);
      return res.redirect(`${frontendUrl}/login?error=${encodeURIComponent(err.message)}`);
    }
  }
}
