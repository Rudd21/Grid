import { IsArray, IsHash, IsString, MinLength } from "class-validator";


export class UpdateUserDto {
    @IsString()
    @MinLength(3, {message: "Мінімальний розмір імені"})
    name!: string;
}