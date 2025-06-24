import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  [x: string]: any;
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty({ enum: ['admin', 'teacher', 'user'] })
  role: 'admin' | 'teacher' | 'user';
}
