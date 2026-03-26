<script setup lang="ts">
import { useModal } from '~/hooks/useModal';
import CreateSprint from '~/modal/CreateSprint.vue';
import CreateTask from '~/modal/CreateTask.vue';


const route = useRoute();
const projectId = route.params.id;
const sprints = ref()
const tasks = ref()
const isLoading = ref(false);

type Task = {
    title: string;
    description: string,
    priority: string,
    sprintId: string;
    userId?: string,
    takedAt?: Date,
};

async function requestSprint() {
    try{
        isLoading.value = true
        const response = await $fetch<any>(`http://localhost:8000/project/${projectId}/task`,{
            'method': 'GET',
            'credentials': 'include'
        })

        sprints.value = response;
    }catch(error){
        console.error('Виникла помилка: ', error)
    }finally{
        isLoading.value = false
    }    
}

onMounted(()=>{
    requestSprint()
})

const modal = useModal()

const openCreateSprint = () => {
    modal.open({
        component: CreateSprint,
        props:{
            projectId: projectId
        }
    })
}

const openCreateTask = (sprintId: string) => {
    modal.open({
        component: CreateTask,
        props:{
            data: sprintId
        }
    })
}


</script>

<template>
    <div>
        <h1 v-if="isLoading">Загрузка...</h1>

            <div class="p-1 m-1 border-2" v-if="sprints && sprints.length > 0">
                <h1 class="p-1 m-1" >Спринти:</h1>
                <div class="m-2 p-1 border-2 border-[green]" v-for="sprint in sprints">
                    <h1>Id sprint: {{ sprint.id }}</h1>
                    <p>Title: {{ sprint.title }}</p>
                    <p>{{ sprint?.tasks }}</p>
                    <button class="p-2 m-2 bg-green-400 text-white" @click="openCreateTask(sprint.id)">Створити нову задачу</button>
                </div>
            </div>

            <div v-else-if="!sprints || sprints.length == 0">
                <h1>Спринтів немає, створіть</h1>
                <button class="p-2 m-3 text-white bg-green-400" @click="openCreateSprint">Створити спринт</button>
            </div>


        <div v-else>
            <h1>Виникла помилка</h1>
        </div>
    </div>
</template>