import type { Member } from "./member"
import type { Task } from "./task"

export interface User {
    id: string;
    email: string;
    name: string;
    password: string;

    membership?: Member[];
    tasks?: Task[];
}

export interface CreateUserDto{
    name: string;
    email: string;
    password: string;
}