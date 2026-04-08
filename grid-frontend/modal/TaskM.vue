<script setup lang="ts">
import { TaskStatus, type CreateTaskDto, type Task } from '~/types/task';
import type { User } from '~/types/user';


const props = defineProps<{
    projectId: string,
    taskId: string,
    title: string,
    description: string,
    difficulty: TaskStatus
}>();

const task = ref<Task | null>(null);
const emit = defineEmits(['updated'])
const formState = ref();

async function reqTask() {
    try{
        task.value = await $fetch(`http://localhost:8000/task/${props.taskId}`,{
            method: 'GET',
            credentials: 'include'
        })
    }catch(error){
        console.error("Виникла помилка при отримані задачі: ", error)
    }
}

onMounted(()=>{
    reqTask()
})

const form = reactive<CreateTaskDto>({
    title: props.title ?? '',
    description: props.description ?? '',
    difficulty: props.difficulty ?? TaskStatus.EASY
})

async function sentForm(params: CreateTaskDto) {
    try{
        formState.value = "Оновлення..."

        await $fetch(`http://localhost:8000/task/${props.taskId}?projectId=${props.projectId}`,{
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
        <section class="m-5">
            <h2>Про задачу: </h2>
            <p>{{ task?.id }}</p>
            <p>{{ task?.title }}</p>
            <p>{{ task?.difficulty }}</p>
            <p>Description{{ task?.description }}</p>
        </section>
        <form class="flex flex-col border-2 p-8 m-3" action="submit" @submit.prevent="sentForm(form)">
            <h1 class="text-[20px] font-bold text-center">Create task</h1>
            <div class="w-[80%] flex flex-col m-auto">
                <label class="p-1">
                    Input name:
                    <input v-model="form.title" class="border p-1" type="text" required>
                </label>
                <label class="p-1">
                    Input description:
                    <input v-model="form.description" class="border p-1" type="text" required>
                </label>
                <label class="p-1">
                    Difficulty:
                    <select v-model="form.difficulty" class="border p-1" required>
                        <option disabled value="">Оберіть складність</option>
                        <option value="EASY">EASY</option>
                        <option value="MEDIUM">MEDIUM</option>
                        <option value="HARD">HARD</option>
                    </select>
                </label>
            </div>
            <button class="p-2 m-2 bg-green-400 text-white" type="submit">Update</button>
            <p v-if="formState">{{ formState }}</p>
        </form>
    </div>
</template>