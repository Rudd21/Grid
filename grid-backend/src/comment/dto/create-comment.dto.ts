import { IsString } from "class-validator";

export class CreateCommentDto {
    @IsString({message:"Комент має бути строкою"})
    text!: string 
}
