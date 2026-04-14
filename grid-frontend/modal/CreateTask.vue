<script setup lang="ts">
import { TaskDifficulty, type CreateTaskDto } from '~/types/task';

const props = defineProps<{sprintId:string}>();

const route = useRoute();
const projectId = route.params.id as string;
const isSuccess = ref(false);

const form = reactive<CreateTaskDto>({
    title: '',
    description: '',
    difficulty: TaskDifficulty.MEDIUM
})

async function createTask(args: CreateTaskDto) {
    try{
        await $fetch(`http://localhost:8000/sprint/${props.sprintId}/task?projectId=${projectId}`,{
            method: 'POST',
            body: {
                ...form
            },
            credentials: 'include',
        })

        isSuccess.value = true
    }catch (error: any) {
        const backendError = error.response?._data;
        console.error("Деталі помилки з бекенду:", backendError);
    }finally{

        }
}

</script>

<template>
    <div class="flex flex-col h-[85vh] items-center justify-center">
        <form class="flex flex-col border-[green] border-2 p-8 m-3" action="submit" @submit.prevent="createTask(form)">
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
            <button class="p-2 m-2 bg-green-400 text-white" type="submit">Create</button>
        </form>
        <div v-if="isSuccess">
            <h1>Успішно додано задачу</h1>
        </div>
    </div>
</template>