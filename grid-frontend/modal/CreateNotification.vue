<script setup lang="ts">
import type { Member } from '~/types/member';
import { NotificationType, type CreateNotificationDto } from '~/types/notification';
import type { Sprint } from '~/types/sprint';
import type { Task } from '~/types/task';


const props = defineProps<{
    projectId: string,
    receiverId?: string, 
    taskId?: string
}>();

const members = ref<Member[] | null>(null);
const sprint = ref<Sprint | null>(null);

async function reqMembers() {
    try{
        members.value = await $fetch(`http://localhost:8000/project/${props.projectId}/members`,{
            method: 'GET',
            credentials: 'include'
        })
    }catch(error){
        console.error("Невдалося зібрати учасників: ", error)
    }
}

async function reqSprint() {
    try{
        sprint.value = await $fetch(`http://localhost:8000/project/${props.projectId}/activeTask`,{
            method: 'GET',
            credentials: 'include'
        })
    }catch(error){
        console.error("Невдалося зібрати задачі: ", error)
    }
}

onMounted(()=>{
    reqMembers()
    reqSprint()
})

const form = reactive<CreateNotificationDto>({
    type: NotificationType.TASK_RECOMMEND,
    message: '',
    id_receiver: props.receiverId ?? '',
    id_task: props.taskId ?? '',
})

async function submitForm() {
    try{
        await $fetch('http://localhost:8000/notification',{
            method: 'POST',
            credentials: 'include',
            body: form
        })
    }catch(error){
        console.error("Виникла помилка при створенні сповіщення: ", error)
    }
}

</script>

<template>
    <div>
        <h1>Назначити задачу</h1>
        <form class="flex flex-col p-3" v-if="sprint && members" action="submit" @submit.prevent="submitForm">
            
            <label class="p-1">
                Тип назначення:
                <select v-model="form.type">
                    <option value="TASK_RECOMMEND">Рекомендувати</option>
                    <option value="TASK_TRANSFER">Перекинути</option>
                </select>
            </label>

            <label class="p-1">
                Повідомлення:
                <input type="text" v-model="form.message">
            </label>

            <label id="id_user" name="id_user" class="p-1" v-if="!props.receiverId">
                Користувач:
                <select v-model="form.id_receiver">
                    <option
                        v-for="member in members"
                        :key="member.user.id"
                        :value="member.user.id"
                    >
                        {{ member.user.name }}
                    </option>
                </select>
            </label>

            <label class="p-1" v-if="!props.taskId">
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

            <button type="submit">Запропонувати</button>
        </form>
    </div>
</template>