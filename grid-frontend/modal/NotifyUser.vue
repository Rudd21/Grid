<script setup lang="ts">
import type { Member } from '~/types/member';
import { NotificationType, type CreateNotificationDto } from '~/types/notification';
import type { Sprint } from '~/types/sprint';
import type { Task, TaskDifficulty } from '~/types/task';
import { getRecommendedDevelopers } from '~/types/user';

const props = defineProps<{
    projectId: string,
    
    receiverSkill?: number,
    receiverId?: string, 

    task?: Task,
    taskDifficulty?: TaskDifficulty
}>();

const {data: options, error} = useFetch<Member[] | Sprint>(
    () => {
        return props.task ? `http://localhost:8000/project/${props.projectId}/members` : `http://localhost:8000/project/${props.projectId}/activeTask`
    },{
        credentials: 'include'
    }
)

const processedMembers = computed(()=>{
    if(!props.task || !props.taskDifficulty) return;

    const members = Array.isArray(options.value) ? (options.value as Member[]) : [];

    return getRecommendedDevelopers(members, props.task);
})

const sprint = computed(()=>{
    return (options.value && !Array.isArray(options.value)) ? (options.value as Sprint) : null
})


const form = reactive<CreateNotificationDto>({
    type: NotificationType.TASK_RECOMMEND,
    message: '',
    id_receiver: props.receiverId ?? '',
    id_task: '',
    id_project: props.projectId
})

async function submitForm() {
    try{
        await $fetch('http://localhost:8000/notification',{
            method: 'POST',
            body: form,
            credentials: 'include'
        })
    }catch(error){
        console.error("Виникла помилка при створенні сповіщення: ", error)
    }
}

</script>

<template>
    <div>
        <h1>Назначити задачу</h1>
        <form class="flex flex-col p-3" action="submit" @submit.prevent="submitForm">
            
            <label class="p-1">
                Тип назначення:
                <select v-model="form.type">
                    <option value="TASK_RECOMMEND">Рекомендувати</option>
                </select>
            </label>

            <label v-if="processedMembers" id="id_user" name="id_user" class="p-1">
                Користувач:
                <select v-model="form.id_receiver">
                    <option
                        v-for="member in processedMembers"
                        :key="member.user.id"
                        :value="member.user.id"
                    >
                        {{ member.user.name }} {{ member.isRecommended ? '(Реконмендує)' : '' }}
                    </option>
                </select>
            </label>

            <label v-if="sprint" class="p-1">
                Задача:
                <select id="id_task" name="id_task" v-model="form.id_task">
                    <option
                        v-for="task in sprint.tasks"
                        :key="task.id"
                        :value="task.id"
                    >
                        {{ task.title }}
                    </option>
                </select>
            </label>

            <label class="p-1">
                Повідомлення:
                <input type="text" v-model="form.message">
            </label>

            <button type="submit">Запропонувати</button>
        </form>
    </div>
</template>