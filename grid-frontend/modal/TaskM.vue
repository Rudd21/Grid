<script setup lang="ts">
import { useModal } from '~/hooks/useModal';
import type { Sprint } from '~/types/sprint';
import { TaskStatus, type CreateTaskDto, type Task, type UpdateTaskDto } from '~/types/task';
import type { User } from '~/types/user';
import CreateNotification from './CreateNotification.vue';
import CommitM from './CommitM.vue';

const props = defineProps<{
    projectId: string,
    sprintId: string,
    taskId: string,
}>();

const projectId = props.projectId;

const data = ref<{task: Task, sprints: Sprint[]} | null>(null);
const emit = defineEmits(['updated'])
const formState = ref();
const modal = useModal()

const form = reactive<UpdateTaskDto>({
    title: data.value?.task.title ?? '',
    description: data.value?.task.description ?? '',
    difficulty: data.value?.task.difficulty ?? TaskStatus.EASY,
    id_sprint: data.value?.task.id_sprint ?? ''
})

async function reqTask() {
    try{
        data.value = await $fetch(`http://localhost:8000/task/${props.taskId}?projectId=${props.projectId}`,{
            method: 'GET',
            credentials: 'include'
        })
    }catch(error){
        console.error("Виникла помилка при отримані задачі: ", error)
    }
}

watch(data, (newData) => {
    if(!newData) return
    form.title = newData.task.title ?? ''
    form.description = newData.task.description ?? ''
    form.difficulty = newData.task.difficulty ?? ''
    form.id_sprint = newData.task.id_sprint ?? ''
})

onMounted(()=>{
    reqTask()
})

async function sentForm(params: UpdateTaskDto) {
    try{
        formState.value = "Оновлення..."

        await $fetch(`http://localhost:8000/task/${data.value?.task.id}`,{
            method: 'PATCH',
            body: form,
            credentials: 'include'
        })

        formState.value = "Завдання успішно оновлено"
        emit('updated')
    }catch(error){
        console.error("Виникла помилка при оновленні задачі: ", error)
    }
}

const openNotification = (taskId: string) =>{
    modal.open({
        component: CreateNotification,
        props:{
            projectId,
            taskId
        }
    })
}

</script>

<template>
    <div class="flex">
        <div v-if="!form.title" class="flex justify-center p-4">
            Завантаження...
        </div>

        <div v-else class="flex">
            <h1 class="text-[20px] font-bold text-center">About task</h1>
            <form class="flex flex-col p-8 m-3 gap-3" action="submit" @submit.prevent="sentForm(form)">
                <div class="flex flex-col m-auto">
                    <label class="flex gap-1 items-center p-1">
                        <p class="text-gray-400">Title:</p>
                        <input v-model="form.title" class="p-1" type="text" required>
                    </label>
                    <label class="flex flex-col gap-1 p-1">
                        <p class="text-gray-400">Description:</p>
                        <textarea v-model="form.description" class="border p-1 rounded-[5px]" type="text" required></textarea>
                    </label>
                    <label class="flex gap-1 items-center p-1">
                        <p class="text-gray-400">Difficulty:</p>
                        <select v-model="form.difficulty" class="p-1" required>
                            <option disabled value="">Оберіть складність</option>
                            <option value="EASY">EASY</option>
                            <option value="MEDIUM">MEDIUM</option>
                            <option value="HARD">HARD</option>
                        </select>
                    </label>
                    <label class="flex gap-1 items-center p-1">
                        <p class="text-gray-400">Sprint:</p>
                        <select v-model="form.id_sprint" class="p-1" required>
                            <option disabled value="">Оберіть спринт</option>
                            <option 
                                v-for="sprint in data?.sprints" 
                                :key="sprint.id"
                                :value="sprint.id"
                            >
                                {{ sprint.title }}
                            </option>
                        </select>
                    </label>
                </div>
                <button class="p-2 m-2 bg-green-400 text-white" type="submit">Update</button>
                <p v-if="formState">{{ formState }}</p>
            </form>
            <section class="p-8">
                <p v-if="data?.task.commit">Задача закрита</p>
                <button 
                    class="bg-blue-600 rounded-[5px] text-white p-2"
                    @click="openNotification(data!.task.id)"
                >    
                    Назначити користувача</button>
                <p>Коментарі:</p>
            </section>
        </div>
    </div>
</template>