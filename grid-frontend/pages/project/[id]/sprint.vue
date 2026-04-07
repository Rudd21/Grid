<script setup lang="ts">
import { useModal } from '~/hooks/useModal';
import CreateSprint from '~/modal/CreateSprint.vue';
import SprintM from '~/modal/SprintM.vue';
import type { Sprint } from '~/types/sprint';


const route = useRoute();
const projectId = route.params.id;
const sprintList = ref();
const activeSprint = ref(false)

interface SprintType extends Sprint{
    isActive: boolean;
    _count: number;
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

const openSprint = (sprint: Sprint) =>{
    modal.open({
        component: SprintM,
        props: {
            title: sprint.title,
            start_date: sprint.start_date,
            end_date: sprint.end_date,
            sprintId: sprint.id
        }
    })
}

</script>

<template>
    <div
        v-for="sprint in sprintList"
        :key="sprint.id"
        class="border m-3 p-2"
        :class="sprint.isActive ? `border-[green]` : `border-[red]`"
    >
        <div class="flex justify-between">
            <h1 class="p-1">{{ sprint.title }}</h1>
            <button
                @click="openSprint(sprint)"
                class="p-1 m-1 bg-gray-400 text-white rounded-[5px]"
            >
                Відредагувати
            </button>
        </div>
        <div class="flex justify-between items-center border p-2">
            <div>
                <p>Start Date: {{ formatDate(sprint.start_date) }}</p>
                <p>End date: {{ formatDate(sprint.end_date) }} ({{ sprint.deadline }} днів)</p>
            </div>
            
            <p>Count of tasks: {{ sprint._count.tasks }}</p>
            <p>Status: {{ sprint.isActive ? "Активний" : "Завершений" }}</p> 
        </div>
    </div>
    <button class="p-2 m-3 text-white bg-green-400" @click="openModal">Створити спринт</button>
</template>