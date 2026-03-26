import { TaskStatus } from "@prisma/client";
import { IsEnum, IsString, MinLength } from "class-validator";


export class CreateTaskDto {
    @IsString()
    @MinLength(3, {message: "Мінімальна довжина назви завдання"})
    title: string;

    @IsString()
    description: string;

    @IsEnum(TaskStatus, {message: "Вказано варіант якого не існує"})
    priority: TaskStatus
}