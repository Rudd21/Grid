import { IsDateString, IsNotEmpty, IsString, IsUUID, MaxLength, MinDate, MinLength } from "class-validator";


export class CreateSprintDto {
    @IsString()
    @MinLength(3, {message: "Замало символів"})
    title!: string;

    @IsDateString({}, {message: "Дата початку має бути у форматі ISO (напр. 2026-03-24)"})
    start_date!: string;

    @IsDateString({}, {message: "Дата завершення має бути у форматі ISO"})
    end_date!: string;
}