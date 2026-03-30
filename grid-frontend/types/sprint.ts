import type { Task } from "./task"


export interface Sprint {
    id: string;
    title: string;
    start_date: string;
    end_date: string;
    id_project: string;

    tasks?: Task[];
}

export interface CreateSprintDto {
    title: string;
    start_date: string;
    end_date: string;
}