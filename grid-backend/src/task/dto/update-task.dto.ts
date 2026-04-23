import { PartialType } from '@nestjs/mapped-types';
import { IsArray, IsDateString, IsEnum, IsString, IsUUID, MinLength } from 'class-validator';
import { CreateTaskDto } from './create-task.dto';
import { TaskDifficulty } from '@prisma/client';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
    @IsString()
    @MinLength(3, {message: "Мінімальна довжина назви завдання"})
    title!: string;

    @IsString()
    description!: string;

    @IsArray({message: "Теги до завдань мають бути масивом"})
    tags!: []

    @IsEnum(TaskDifficulty, {message: "Вказано варіант якого не існує"})
    difficulty!: TaskDifficulty

    @IsUUID(4, {message: "Невірний формат ID спринту"})
    id_sprint!: string
}
