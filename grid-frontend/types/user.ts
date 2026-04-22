import type { Member } from "./member"
import type { Task } from "./task"

enum ExperienceLevel {
    JUNIOR = "JUNIOR",
    MIDDLE = "MIDDLE",
    SENIOR = "SENIOR"
}

export interface User {
    id: string;
    email: string;
    name: string;
    password: string;

    skills: string[];
    experienceLevel: ExperienceLevel;
    membership?: Member[];
    tasks?: Task[];
}

export interface CreateUserDto{
    name: string;
    email: string;
    password: string;
}

export function getRecommendedDevelopers(members: Member[], task: Task){
    return members.map((member) =>{
        const user = member.user;

        if(!user || !user.skills) return {...member, isRecommended: false}

        const matchCount = task.tags.filter(tag => user.skills.includes(tag)).length

        const isLevelMatch = !(task.difficulty === 'HARD' && user.experienceLevel === 'JUNIOR');

        return {
            ...member,
            isRecommended: matchCount > 0 && isLevelMatch
        }
    })
}


