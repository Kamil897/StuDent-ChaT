export class LoginDto {
  emailOrUsername: string;
  password: string;
  role: 'admin' | 'parent' | 'teacher' | 'user';
}
