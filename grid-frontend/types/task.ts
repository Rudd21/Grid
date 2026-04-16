import type { Comment } from "./comment";
import type { User } from "./user";

export enum TaskDifficulty {
  EASY = "EASY",
  MEDIUM = "MEDIUM",
  HARD = "HARD"
}

export enum TaskStatus {
  TODO = "TODO",
  DOING = "DOING",
  DONE = "DONE"
}

export interface Task {
    id: string;
    title: string;
    description: string;
    difficulty: TaskDifficulty;
    id_sprint: string;
    id_project: string;
    status: TaskStatus; 

    comment: Comment[]

    commit: string;
    commit_description: string;
    done_at: string;
    
    taken_at?: string;
    id_user?: string
    user?: User
}

export interface CreateTaskDto {
    title: string;
    description: string;
    difficulty: TaskDifficulty;
}

export interface UpdateTaskDto{
    title: string;
    description: string;
    difficulty: TaskDifficulty;
    id_sprint: string;
}

export interface CommitDto{
    commit: string;
    commit_description: string;
    done_at: string;
}