import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Не вірний формат email.' })
  email: string;
  @IsString({ message: 'Пароль має бути рядком.' })
  password: string;
}
