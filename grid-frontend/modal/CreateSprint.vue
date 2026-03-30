<script setup lang="ts">
import type { CreateSprintDto } from '~/types/sprint';


const props = defineProps<{projectId: string}>();

const isSuccess = ref(false);

const form = reactive<CreateSprintDto>({
    title: '',
    start_date: '',
    end_date: ''
})

async function createSprint(args: CreateSprintDto){
    try{
        await $fetch(`http://localhost:8000/project/${props.projectId}/sprint`,{
            method: 'POST',
            body: {
                title: form.title,
                start_date: form.start_date,
                end_date: form.end_date
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
    <div class="flex flex-col p-5 items-center justify-center">
        <form class=" flex flex-col border-[green] border-2 p-4" action="submit" @submit.prevent="createSprint(form)">
            <h1 class="text-[20px] font-bold">Create sprint</h1>
            <div class="w-[80%] flex flex-col m-auto">
                <label class="p-1">
                    Input sprint name:
                    <input v-model="form.title" class="border p-1" type="text" required>
                </label>
                <label class="p-1">
                    Date start:
                    <input v-model="form.start_date" class="border p-1" type="date" required>
                </label>
                <label class="p-1">
                    Date end:
                    <input v-model="form.end_date" class="border p-1" type="date" required>
                </label>
            </div>
            <button class="p-2 bg-green-300 w-[30%] m-auto mt-10 hover:bg-green-500 transition" type="submit">Create</button>
        </form>
        <div v-if="isSuccess">
            <h1>Успішно додано спринт</h1>
        </div>
    </div>
</template>