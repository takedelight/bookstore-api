import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString({ message: "Ім'я має бути рядком" })
  first_name: string;
  @IsOptional()
  @IsString({ message: 'Прізвище має бути рядком' })
  last_name?: string;
  @IsEmail({}, { message: 'Email має бути рядком' })
  email: string;
  @IsString({ message: 'Пароль має бути рядком' })
  password: string;
}
