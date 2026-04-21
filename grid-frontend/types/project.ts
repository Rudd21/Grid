import type { Member } from "./member"
import type { Sprint } from "./sprint"
import type { Task } from "./task"

export enum ProjectStatus {
  PLANNED = "PLANNED",
  ACTIVE = "ACTIVE",
  CLOSED = "CLOSED"
}

export interface Project{
    id: string;
    title: string;
    description: string;
    status: ProjectStatus;
    isPublic: Boolean;

    members?: Member[]
    sprints?: Sprint[]
    tasks?: Task[]
}

export interface CreateProjectDto {
    title: string;
    description: string;
    status: ProjectStatus;
}

export interface CrossProject {
    id: string,
    title: string
}
