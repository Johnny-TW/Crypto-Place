import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ description: '貼文標題' })
  @IsString()
  title: string;

  @ApiProperty({ description: '貼文內容', required: false })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({ description: '作者ID' })
  @IsNumber()
  authorId: number;
}
