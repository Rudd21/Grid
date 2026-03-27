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
    difficulty: string,
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
            sprintId: sprintId
        }
    })
}


</script>

<template>
    <div>
        <h1 v-if="isLoading">Загрузка...</h1>

            <div 
                class="p-1 m-1 border-2" 
                v-if="sprints && sprints.length > 0">

                <div 
                    class="m-2 p-1" 
                    v-for="sprint in sprints">

                    <div class="flex gap-3">
                        <h1>Спринт: {{ sprint.title }}</h1>
                        <div class="flex justify-start gap-3">
                            <p>Початок: {{ sprint.start_date }}</p>
                            <p>Кінець: {{ sprint.end_date }}</p>
                        </div>
                    </div>
                    <div 
                        v-for="task in sprint.tasks" 
                        :key="task.id"
                        class="p-2 border rounded bg-gray-50">

                        <div class="flex justify-between items-center">
                            <span class="font-medium">{{ task.title }}</span>
                            <p class="text-sm text-gray-600">{{ task.description }}</p>
                            <span 
                                class="text-xs px-2 py-1 rounded "
                                >
                                
                                Difficulty: {{ task.difficulty }}
                            </span>
                            <button class="p-2 bg-blue-600 text-white rounded-[5px]" v-if="!task.taken_at">Взяти задачу</button>
                        </div>
                    </div>

                    <p v-if="!sprint.tasks?.length">У цьому спринті немає ще задач</p>
                    <button 
                        class="p-2 m-2 bg-green-400 text-white" 
                        @click="openCreateTask(sprint.id)">
                        
                        + Додати нову задачу</button>
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