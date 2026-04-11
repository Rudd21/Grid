import { NotificationType } from "@prisma/client";
import { IsEnum, IsString, IsUUID, MaxLength, MinLength } from "class-validator";

export class CreateNotificationDto {
    @IsEnum(NotificationType, {message: "Вказано значення якого не існує"})
    type!: NotificationType

    @IsString()
    @MaxLength(250, {message: "Максимальна довжина"})
    message!: string

    @IsUUID('4', {message: "Невірний формат ID користувача"})
    id_receiver!: string
    
    @IsUUID('4', {message: "Невірний формат ID задачі"})
    id_task!: string

    @IsUUID(4, {message: "Невірний формат ID проєкту"})
    id_project!: string
}