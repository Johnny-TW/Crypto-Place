import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'user@example.com',
    description: '用戶電子郵件',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'password123',
    description: '密碼',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class RegisterDto {
  @ApiProperty({
    example: 'user@example.com',
    description: '用戶電子郵件',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'John Doe',
    description: '用戶姓名',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'password123',
    description: '密碼（至少6個字符）',
  })
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;
}

export class AuthResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT 存取令牌',
  })
  access_token: string;

  @ApiProperty({
    example: {
      id: 1,
      email: 'user@example.com',
      name: 'John Doe',
      role: 'USER',
    },
    description: '用戶資訊',
  })
  user: {
    id: number;
    email: string;
    name: string;
    role: string;
  };
}

export class UserProfileDto {
  @ApiProperty({
    example: 1,
    description: '用戶 ID',
  })
  id: number;

  @ApiProperty({
    example: 'user@example.com',
    description: '用戶電子郵件',
  })
  email: string;

  @ApiProperty({
    example: 'John Doe',
    description: '用戶姓名',
  })
  name: string;

  @ApiProperty({
    example: 'USER',
    description: '用戶角色',
  })
  role: string;

  @ApiProperty({
    example: true,
    description: '帳戶是否活躍',
  })
  isActive: boolean;

  @ApiProperty({
    example: '2024-01-01T00:00:00Z',
    description: '創建時間',
  })
  createdAt: string;
}
