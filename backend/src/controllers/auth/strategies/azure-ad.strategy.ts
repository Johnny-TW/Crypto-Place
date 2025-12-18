import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { OIDCStrategy } from 'passport-azure-ad';
import { ConfigService } from '@nestjs/config';

export interface AzureAdProfile {
  oid: string;
  displayName: string;
  emails?: string[];
  email?: string;
  name?: {
    givenName?: string;
    familyName?: string;
  };
  _json?: {
    preferred_username?: string;
    unique_name?: string;
    upn?: string;
  };
}

@Injectable()
export class AzureAdStrategy extends PassportStrategy(OIDCStrategy, 'azure-ad') {
  constructor(private configService: ConfigService) {
    super({
      identityMetadata: `${configService.get<string>('AZURE_AD_CLOUD_INSTANCE')}${configService.get<string>('AZURE_AD_TENANT_ID')}/v2.0/.well-known/openid-configuration`,
      clientID: configService.get<string>('AZURE_AD_CLIENT_ID'),
      clientSecret: configService.get<string>('AZURE_AD_CLIENT_SECRET'),
      // 使用 Authorization Code Flow，避免跨域 cookie 問題
      responseType: 'code',
      responseMode: 'query',
      redirectUrl: configService.get<string>('AZURE_AD_REDIRECT_URI'),
      allowHttpForRedirectUrl: true, // 開發環境允許 HTTP
      scope: ['profile', 'email', 'openid'],
      prompt: 'select_account', // 每次都顯示帳號選擇畫面
      loggingLevel: 'info',
      passReqToCallback: false,
      validateIssuer: true,
      issuer: `https://login.microsoftonline.com/${configService.get<string>('AZURE_AD_TENANT_ID')}/v2.0`,
      // Authorization Code Flow 使用 state 參數（query string），不依賴 cookie
      useCookieInsteadOfSession: true,
      cookieEncryptionKeys: [
        { key: configService.get<string>('JWT_SECRET')?.substring(0, 32) || '12345678901234567890123456789012', iv: '123456789012' },
      ],
      cookieSameSite: false, // 允許跨站 cookie
    });
  }

  async validate(profile: AzureAdProfile): Promise<any> {
    console.log('🔍 Azure AD Profile received:', JSON.stringify(profile, null, 2));

    // 從 Azure AD profile 提取使用者資訊
    const email =
      profile.email ||
      profile._json?.preferred_username ||
      profile._json?.unique_name ||
      profile._json?.upn ||
      (profile.emails && profile.emails[0]);

    const name =
      profile.displayName ||
      `${profile.name?.givenName || ''} ${profile.name?.familyName || ''}`.trim();

    console.log('✅ Extracted - Email:', email, 'Name:', name, 'OID:', profile.oid);

    return {
      azureId: profile.oid,
      email,
      name,
      loginType: 'azure-ad',
      profile,
    };
  }
}