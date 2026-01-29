import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ConfidentialClientApplication,
  Configuration,
  AuthorizationCodeRequest,
  AuthorizationUrlRequest,
  CryptoProvider,
} from '@azure/msal-node';

export interface AzureAdUserInfo {
  azureId: string;
  email: string;
  name: string;
}

@Injectable()
export class MsalService {
  private msalClient: ConfidentialClientApplication;
  private cryptoProvider: CryptoProvider;
  private redirectUri: string;

  constructor(private configService: ConfigService) {
    const msalConfig: Configuration = {
      auth: {
        clientId: this.configService.get<string>('AZURE_AD_CLIENT_ID') || '',
        authority: `${this.configService.get<string>('AZURE_AD_CLOUD_INSTANCE')}${this.configService.get<string>('AZURE_AD_TENANT_ID')}`,
        clientSecret: this.configService.get<string>('AZURE_AD_CLIENT_SECRET'),
      },
      system: {
        loggerOptions: {
          loggerCallback: (level, message) => {
            console.log(`[MSAL ${level}] ${message}`);
          },
          piiLoggingEnabled: false,
          logLevel: 3,
        },
      },
    };

    this.msalClient = new ConfidentialClientApplication(msalConfig);
    this.cryptoProvider = new CryptoProvider();
    this.redirectUri =
      this.configService.get<string>('AZURE_AD_REDIRECT_URI') ||
      'http://localhost:5001/api/auth/azure/callback';
  }

  async getAuthUrl(): Promise<{
    authUrl: string;
    state: string;
    codeVerifier: string;
  }> {
    const { verifier, challenge } =
      await this.cryptoProvider.generatePkceCodes();
    const state = this.cryptoProvider.createNewGuid();

    const authCodeUrlParameters: AuthorizationUrlRequest = {
      scopes: ['openid', 'profile', 'email'],
      redirectUri: this.redirectUri,
      state: state,
      codeChallenge: challenge,
      codeChallengeMethod: 'S256',
      prompt: 'select_account',
      responseMode: 'query', // 使用 query 模式避免 form_post 中間頁面卡住
    };

    const authUrl = await this.msalClient.getAuthCodeUrl(authCodeUrlParameters);

    return { authUrl, state, codeVerifier: verifier };
  }

  async acquireTokenByCode(
    code: string,
    codeVerifier: string,
  ): Promise<AzureAdUserInfo> {
    const tokenRequest: AuthorizationCodeRequest = {
      code,
      scopes: ['openid', 'profile', 'email'],
      redirectUri: this.redirectUri,
      codeVerifier,
    };

    const response = await this.msalClient.acquireTokenByCode(tokenRequest);

    console.log('🔍 MSAL Token Response:', {
      account: response.account,
      idTokenClaims: response.idTokenClaims,
    });

    const claims = response.idTokenClaims as Record<string, any>;

    const email =
      claims.preferred_username ||
      claims.email ||
      claims.upn ||
      response.account?.username ||
      '';

    const name =
      claims.name ||
      `${claims.given_name || ''} ${claims.family_name || ''}`.trim() ||
      email.split('@')[0];

    const azureId =
      claims.oid || claims.sub || response.account?.localAccountId || '';

    console.log('✅ Extracted User Info:', { azureId, email, name });

    return { azureId, email, name };
  }
}
