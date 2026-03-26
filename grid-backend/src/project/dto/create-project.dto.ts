import { ProjectStatus } from "@prisma/client";
import { IsEnum, IsString, MaxLength, MinLength } from "class-validator";


export class CreateProjectDto {
    @IsString()
    @MinLength(3, {message: "Замало символів"})
    title: string

    @IsString()
    @MaxLength(200, {message: "Максимальна довжина опису досягнута"})
    description: string

    @IsEnum(ProjectStatus, {message: "Вказано статус, що не відповідає наявним"})
    status: ProjectStatus
}