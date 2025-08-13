import { ApiProperty } from '@nestjs/swagger';

export class CreateAuthDto {
  @ApiProperty()
  emplid: string;
}

