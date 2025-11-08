import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

interface ChatRequest {
  message: string;
  userId?: string;
  context?: any;
}

interface ChatResponse {
  response: string;
  timestamp: Date;
}

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly chainlitUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.chainlitUrl =
      this.configService.get<string>('CHAINLIT_SERVICE_URL') ||
      'http://localhost:8000';
    this.logger.log(`Chainlit service URL: ${this.chainlitUrl}`);
  }

  /**
   * 發送訊息到 Chainlit AI 服務
   */
  async sendMessage(chatRequest: ChatRequest): Promise<ChatResponse> {
    try {
      const { message, userId, context } = chatRequest;

      // 如果有 userId，可以從資料庫獲取用戶相關數據
      let enrichedContext = context || {};

      if (userId) {
        // 這裡可以加入用戶的 watchlist、portfolio 等數據
        // enrichedContext.userData = await this.getUserData(userId);
      }

      const response = await firstValueFrom(
        this.httpService.post(
          `${this.chainlitUrl}/api/chat`,
          {
            message,
            userId,
            context: enrichedContext,
          },
          {
            timeout: 30000,
          },
        ),
      );

      return {
        response: response.data.response,
        timestamp: new Date(),
      };
    } catch (error) {
      this.logger.error('Error communicating with Chainlit service:', error);
      throw new Error(`AI service error: ${error.message}`);
    }
  }

  /**
   * 健康檢查 Chainlit 服務
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.chainlitUrl}/health`, {
          timeout: 5000,
        }),
      );
      return response.status === 200;
    } catch (error) {
      this.logger.warn('Chainlit service health check failed:', error);
      return false;
    }
  }

  // 未來可以添加的方法:
  // - getChatHistory(userId: string)
  // - clearChatHistory(userId: string)
  // - getUserData(userId: string)
}
