import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('AI Chat')
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('chat')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '發送訊息給 AI 助手' })
  async chat(@Request() req, @Body() body: { message: string; context?: any }): Promise<{ success: boolean; data: any }> {
    try {
      const userId = req.user?.userId;
      const { message, context } = body;

      if (!message || message.trim() === '') {
        throw new HttpException('Message is required', HttpStatus.BAD_REQUEST);
      }

      const response = await this.aiService.sendMessage({
        message,
        userId,
        context,
      });

      return {
        success: true,
        data: response,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to process AI request',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('health')
  @ApiOperation({ summary: '檢查 AI 服務健康狀態' })
  async healthCheck() {
    const isHealthy = await this.aiService.healthCheck();

    return {
      success: true,
      data: {
        status: isHealthy ? 'healthy' : 'unhealthy',
        timestamp: new Date(),
      },
    };
  }
}
