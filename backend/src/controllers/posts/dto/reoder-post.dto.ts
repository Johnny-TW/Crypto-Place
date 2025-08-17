import { ApiProperty } from '@nestjs/swagger';

export class ReorderPostDto {
  @ApiProperty()
  sourceIndex: number;

  @ApiProperty()
  targetIndex: number;
}
