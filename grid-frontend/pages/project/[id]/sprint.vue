<script setup lang="ts">
import { useModal } from '~/hooks/useModal';
import CreateSprint from '~/modal/CreateSprint.vue';
import type { Sprint } from '~/types/sprint';


const route = useRoute();
const projectId = route.params.id;
const sprintList = ref();
const activeSprint = ref(false)

interface SprintType extends Sprint{
    isActive: boolean
}

async function reqSprints() {
    try{
        const response = await $fetch<SprintType[]>(`http://localhost:8000/project/${projectId}/sprint`,{
            method: 'GET',
            credentials: 'include'
        })

        sprintList.value = response;
    }catch(error: any){

        const backendError = error.response?._data;
        console.error("Деталі помилки з бекенду:", backendError);
    }finally{

    }
}

onMounted(()=>{
    reqSprints()
})

const modal = useModal();

const openModal = ()=>{
    modal.open({
        component: CreateSprint,
        props: {
            projectId: projectId
        }
    })
}

</script>

<template>
    <div
        v-for="sprint in sprintList"
        :key="sprint.id"
        class="border border-2 m-3 p-2"
        :class="sprint.isActive ? `border-[green]` : `border-[red]`"
    >
        <h1>Title: {{ sprint.title }}</h1>
        <p>Start Date: {{ sprint.start_date }}</p>
        <p>End date: {{ sprint.end_date }}</p>
        <p>{{ sprint.isActive ? "Активний" : "Завершений" }}</p>
    </div>
    <button class="p-2 m-3 text-white bg-green-400" @click="openModal">Створити спринт</button>
</template>