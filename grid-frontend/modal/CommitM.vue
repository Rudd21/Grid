<script setup lang="ts">
import type { CommitDto } from '~/types/task';

const props = defineProps<{
    taskId: string
}>();

const commitState = ref<string | null>(null)
const now = new Date()

const form = reactive<CommitDto>({
    commit: '',
    commit_description: '',
    done_at: now.toISOString()
})

async function sentForm() {
    try{
        commitState.value = 'Оновлення...'

        await $fetch(`http://localhost:8000/task/${props.taskId}/commit`,{
            method:'PATCH',
            body: form,
            credentials: 'include'
        })

        commitState.value = 'Задачу здано'
    }catch(error){
        console.error("Виникла помилка при надсиланні виконаного завдання", error);
        commitState.value = 'Помилка при здачі задачі'
    }
}

</script>

<template>
    <h1>Закомітити задачу</h1>
    <form class="flex flex-col gap-2 items-center" action="submit" @submit.prevent="sentForm">
        <label class="flex gap-1">
            <p class="text-gray-400">Github commit: </p>
            <input v-model="form.commit" type="text">
        </label>
        <label class="flex gap-1">
            <p class="text-gray-400">Commit description: </p>
            <textarea v-model="form.commit_description" type="text"></textarea>
        </label>
        <button class="p-2 bg-green-400 text-white">Здати задачу</button>
    </form>
    <p v-if="commitState">{{commitState}}</p>
</template>