<script setup lang="ts">
import type { Task } from '~/types/task';


const props = defineProps<{
    taskId: string
}>();

const task = ref<Task | null>(null);

async function reqTask() {
    try{
        task.value = await $fetch(`http://localhost:8000/task/${props.taskId}`,{
            method: 'GET',
            credentials: 'include'
        })
    }catch(error){

    }
}

onMounted(()=>{
    reqTask()
})

</script>

<template>
    Модалка по налаштуванні задач {{ task }}
</template>