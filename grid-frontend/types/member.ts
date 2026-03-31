export enum UserRole {
  OWNER = "OWNER",
  MANAGER = "MANAGER",
  MEMBER = "MEMBER"
}

export interface Member {
    id: string;
    role: UserRole
    userId: string
    projectId: string
}

export interface CreateMemberDto{
    email: string
}