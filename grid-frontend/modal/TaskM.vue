<script setup lang="ts">
import type { Sprint } from '~/types/sprint';
import { TaskStatus, type CreateTaskDto, type Task, type UpdateTaskDto } from '~/types/task';
import type { UpdateUserDto, User } from '~/types/user';

const props = defineProps<{
    projectId: string,
    sprintId: string,
    taskId: string,
}>();

const task = ref<{task: Task, sprints: Sprint[]} | null>(null);
const emit = defineEmits(['updated'])
const formState = ref();

const form = reactive<UpdateTaskDto>({
    title: task.value?.task.title ?? '',
    description: task.value?.task.description ?? '',
    difficulty: task.value?.task.difficulty ?? TaskStatus.EASY,
    id_sprint: task.value?.task.id_sprint ?? ''
})

async function reqTask() {
    try{
        task.value = await $fetch(`http://localhost:8000/task/${props.taskId}?projectId=${props.projectId}`,{
            method: 'GET',
            credentials: 'include'
        })
    }catch(error){
        console.error("Виникла помилка при отримані задачі: ", error)
    }
}

watch(task, (newData) => {
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

        await $fetch(`http://localhost:8000/task/${task.value?.task.id}`,{
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

</script>

<template>
    <div class="flex">
        <div v-if="!form.title" class="flex justify-center p-4">
            Завантаження...
        </div>

        <form v-else class="flex flex-col p-8 m-3 gap-3" action="submit" @submit.prevent="sentForm(form)">
            <h1 class="text-[20px] font-bold text-center">About task</h1>
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
                            v-for="sprint in task?.sprints" 
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
    </div>
</template>