import { PartialType } from '@nestjs/mapped-types';
import { IsDateString, IsEnum, IsString, IsUUID, MinLength } from 'class-validator';
import { CreateTaskDto } from './create-task.dto';
import { TaskStatus } from '@prisma/client';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
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
