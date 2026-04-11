import type { Project } from "./project"
import type { Task } from "./task"
import type { User } from "./user"

export enum NotificationType {
  TASK_RECOMMEND = "TASK_RECOMMEND",
  TASK_TRANSFER = "TASK_TRANSFER"
}

export interface Notification {
    id: string,
    type: NotificationType,
    message: string,
    isRead: boolean,
    created_at: string,
    
    receiver: User,
    id_receiver: string,

    sender: User,
    id_sender: string,

    task?: Task,
    id_task?: string

    project?: Project,
    id_project?: string
}

export interface CreateNotificationDto {
    type: NotificationType,
    message: string,
    id_receiver?: string,
    id_task?: string,
    id_project?: string
}