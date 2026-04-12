import { MinLength } from "class-validator";


export class UpdatePasswordDto {
    @MinLength(5, {message: "Мінімальний розмір паролю"})
    newPassword!: string;

    @MinLength(5, {message: "Мінімальний розмір паролю"})
    oldPassword!: string;
}