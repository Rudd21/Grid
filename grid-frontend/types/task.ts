import type { User } from "./user";

export enum TaskStatus {
  EASY = "EASY",
  MEDIUM = "MEDIUM",
  HARD = "HARD"
}

export interface Task {
    id: string;
    title: string;
    description: string;
    difficulty: TaskStatus;
    id_sprint: string;
    id_project: string;

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
    difficulty: TaskStatus;
}

export interface UpdateTaskDto{
    title: string;
    description: string;
    difficulty: TaskStatus;
    id_sprint: string;
}

export interface CommitDto{
    commit: string;
    commit_description: string;
    done_at: string;
}