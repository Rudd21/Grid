import { TaskDifficulty  } from "@prisma/client";
import { IsArray, IsEnum, IsString, IsUUID, MinLength } from "class-validator";


export class CreateTaskDto {
    @IsString()
    @MinLength(3, {message: "Мінімальна довжина назви завдання"})
    title!: string;

    @IsString()
    description!: string;

    @IsArray({message: "Теги до завдань мають бути масивом"})
    tags!: []

    @IsEnum(TaskDifficulty, {message: "Вказано варіант якого не існує"})
    difficulty!: TaskDifficulty
}