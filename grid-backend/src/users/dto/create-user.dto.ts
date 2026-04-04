import { IsEmail, IsString, MaxLength, Min, MinLength } from "class-validator";


export class CreateUserDto {
    @IsEmail({}, {message: 'Некоректний формат email'})
    email!: string;

    @IsString()
    @MinLength(2, {message: "Ім'я має бути не коротше двох символів"})
    name!: string;

    @IsString()
    @MinLength(6, {message: 'Пароль має бути мінімум 6 символів'})
    @MaxLength(20, {message: 'Пароль має бути коротше 20 символів'})
    password!: string;
}