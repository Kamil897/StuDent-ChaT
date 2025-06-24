import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty({ enum: ['admin', 'teacher', 'user'] })
  role: 'admin' | 'teacher' | 'user';
}
