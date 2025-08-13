import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class ReorderPostDto {
  @ApiProperty({ description: '來源位置索引' })
  @IsNumber()
  sourceIndex: number;

  @ApiProperty({ description: '目標位置索引' })
  @IsNumber()
  targetIndex: number;
}
