import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';
import { randomBytes } from 'crypto';

export interface GoogleUserInfo {
  googleId: string;
  email: string;
  name: string;
  picture?: string;
}

@Injectable()
export class GoogleOAuthService {
  private oauth2Client;
  private redirectUri: string;

  constructor(private configService: ConfigService) {
    this.redirectUri =
      this.configService.get<string>('GOOGLE_REDIRECT_URI') ||
      'http://localhost:5001/api/auth/google/callback';

    this.oauth2Client = new google.auth.OAuth2(
      this.configService.get<string>('GOOGLE_CLIENT_ID'),
      this.configService.get<string>('GOOGLE_CLIENT_SECRET'),
      this.redirectUri,
    );
  }

  /**
   * 產生 Google OAuth 授權 URL
   */
  getAuthUrl(): { authUrl: string; state: string } {
    // 產生隨機 state 防止 CSRF
    const state = randomBytes(16).toString('hex');

    const authUrl = this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
        'openid',
      ],
      state,
      prompt: 'select_account', // 每次都顯示帳號選擇
    });

    return { authUrl, state };
  }

  /**
   * 用授權碼換取使用者資訊
   */
  async getUserInfo(code: string): Promise<GoogleUserInfo> {
    // 用 code 換取 tokens
    const { tokens } = await this.oauth2Client.getToken(code);
    this.oauth2Client.setCredentials(tokens);

    // 取得使用者資訊
    const oauth2 = google.oauth2({ version: 'v2', auth: this.oauth2Client });
    const { data } = await oauth2.userinfo.get();

    console.log('🔍 Google User Info:', data);

    return {
      googleId: data.id || '',
      email: data.email || '',
      name: data.name || data.email?.split('@')[0] || '',
      picture: data.picture,
    };
  }
}
