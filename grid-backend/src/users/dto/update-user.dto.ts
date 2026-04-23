import { ExperienceLevel } from "@prisma/client";
import { IsArray, IsEnum, IsHash, IsString, MinLength } from "class-validator";


export class UpdateUserDto {
    @IsString()
    @MinLength(3, {message: "Мінімальний розмір імені"})
    name!: string;

    @IsEnum(ExperienceLevel, {message: 'Вказано варіант якого не існує'})
    experienceLevel!: ExperienceLevel;

    @IsArray({message: 'Навички мають бути масивом'})
    skills!: [];
}