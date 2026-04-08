import { PartialType } from '@nestjs/mapped-types';
import { IsDateString, IsString, MinLength } from 'class-validator';
import { CreateSprintDto } from './create-sprint.dto';

export class UpdateSprintDto extends PartialType(CreateSprintDto) {
    @IsString()
    @MinLength(3, {message: "Замало символів"})
    title!: string;

    @IsDateString({}, {message: "Дата початку має бути у форматі ISO (напр. 2026-03-24)"})
    start_date!: string;

    @IsDateString({}, {message: "Дата завершення має бути у форматі ISO"})
    end_date!: string;
}
