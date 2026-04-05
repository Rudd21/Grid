import type { Project } from "./project";
import type { User } from "./user";

export enum UserRole {
  OWNER = "OWNER",
  MANAGER = "MANAGER",
  MEMBER = "MEMBER"
}

export interface Member {
    id: string;
    role: UserRole

    user: User
    userId: string

    project: Project
    projectId: string
}

export interface CreateMemberDto{
    email: string
}