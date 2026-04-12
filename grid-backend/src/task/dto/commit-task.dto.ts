import { IsString, IsUUID, } from "class-validator";


export class CommitTaskDto {
    @IsString()
    commit!: string;

    @IsString()
    commit_description!: string;

    @IsString()
    done_at!: string
}