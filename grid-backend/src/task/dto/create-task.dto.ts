import { TaskDifficulty  } from "@prisma/client";
import { IsEnum, IsString, IsUUID, MinLength } from "class-validator";


export class CreateTaskDto {
    @IsString()
    @MinLength(3, {message: "Мінімальна довжина назви завдання"})
    title!: string;

    @IsString()
    description!: string;

    @IsEnum(TaskDifficulty, {message: "Вказано варіант якого не існує"})
    difficulty!: TaskDifficulty
}