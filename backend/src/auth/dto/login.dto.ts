export class LoginDto {
  emailOrUsername: string;
  password: string;
  role: 'admin' | 'teacher' | 'parent' | 'user';
}
