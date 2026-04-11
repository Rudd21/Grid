import { TaskStatus } from "@prisma/client";
import { IsEnum, IsString, IsUUID, MinLength } from "class-validator";


export class CreateTaskDto {
    @IsString()
    @MinLength(3, {message: "Мінімальна довжина назви завдання"})
    title!: string;

    @IsString()
    description!: string;

    @IsEnum(TaskStatus, {message: "Вказано варіант якого не існує"})
    difficulty!: TaskStatus

    @IsUUID(4, {message: "Невірний формат ID спринту"})
    id_sprint!: string
}