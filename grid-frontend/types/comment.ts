import type { Task } from "./task";
import type { User } from "./user";

export interface Comment {
    id: string
    text: string

    user: User
    id_user: string

    task: Task
    id_task: string
}