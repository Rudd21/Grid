import { IsArray, IsHash, IsString, MinLength } from "class-validator";


export class UpdateUserDto {
    @IsString()
    @MinLength(3, {message: "Мінімальний розмір імені"})
    name!: string;

    @MinLength(5, {message: "Мінімальний розмір паролю"})
    newPassword!: string;

    @MinLength(5, {message: "Мінімальний розмір паролю"})
    oldPassword!: string;

    @IsArray({message: "Скіли мають бути масивом"})
    skills!: [];
}