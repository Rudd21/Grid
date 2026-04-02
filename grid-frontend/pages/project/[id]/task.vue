<script setup lang="ts">
import { io } from 'socket.io-client';
import { useModal } from '~/hooks/useModal';
import CreateSprint from '~/modal/CreateSprint.vue';
import CreateTask from '~/modal/CreateTask.vue';
import type { Sprint } from '~/types/sprint';
import type { Task } from '~/types/task';

const route = useRoute();
const projectId = route.params.id;
const sprint = ref<Sprint | null>(null);

const auth = useAuthStore();

const requestSprint = async() => {
    try{
        const response = await $fetch<Sprint>(`http://localhost:8000/project/${projectId}/activeTask`,{
            'method': 'GET',
            'credentials': 'include'
        })

        sprint.value = response;
    }catch(error){
        console.error('Виникла помилка: ', error)
    }
}

let socket: any = null;
onMounted(async ()=>{
    await requestSprint()

    socket = io('http://localhost:8000',{
        transports: ['websocket'],
    });

    socket.emit('joinProject', projectId)

    socket.on('taskUpdate', (updatedTask: any)=>{
        console.log("Оновлення таски: ", updatedTask);

        if(!sprint.value || !sprint.value.tasks) return;

        const index = sprint.value.tasks.findIndex((t: Task) => t.id === updatedTask.id);

        if(index != -1){
            sprint.value.tasks = sprint.value.tasks.map((t: Task) =>
                t.id === updatedTask.id ? {...t, ...updatedTask} : t 
            );
            console.log("Масив оновлено: ", sprint.value.tasks[index]);
        }
    })
});

onUnmounted(()=>{
    if(socket){
        socket.emit('leaveProject', projectId);
        socket.disconnect();
    }
})


async function takeTask(sprintId: string, taskId: string) {
    try{
        await $fetch(`http://localhost:8000/sprint/${sprintId}/task/${taskId}`,{
            method: 'PATCH',
            credentials: 'include'
        })
    }catch(error){
        console.error("Виникла помилка при взятті задачі: ", error);
    }
}

async function removeTask(sprintId: string, taskId: string) {
    try{
        await $fetch(`http://localhost:8000/sprint/${sprintId}/task/${taskId}`,{
            method: 'DELETE',
            credentials: 'include'
        })
    }catch(error){
        console.error("Виникла помилка при знятті задачі: ", error);
    }
}


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
            <div 
                class="p-1 m-1 border-2" 
                v-if="sprint">

                <div 
                    class="m-2 p-1">

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
                            <div>
                                <button 
                                    v-if="!task.user" 
                                    @click="takeTask(sprint.id, task.id)"
                                    class="p-2 bg-blue-600 text-white rounded-[5px]"
                                    >Взяти задачу
                                </button>
                                <div v-else>
                                    <button 
                                        class="p-2 mr-2 bg-gray-600 text-white rounded-[5px]"
                                        >Задача взята користувачем: {{ task.user.name }}
                                    </button>
                                    <button 
                                        v-if="auth.userId == task.user?.id"
                                        @click="removeTask(sprint.id, task.id)"
                                        class="w-5 h-5 bg-red-600 text-white rounded-[5px]"
                                        >
                                        x
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <p v-if="!sprint.tasks?.length">У цьому спринті немає ще задач</p>
                    <button 
                        class="p-2 m-2 bg-green-400 text-white" 
                        @click="openCreateTask(sprint.id)">
                        
                        + Додати нову задачу</button>
                </div>
            </div>

            <div v-else="!sprint">
                <h1>Спринтів немає, створіть</h1>
                <button class="p-2 m-3 text-white bg-green-400" @click="openCreateSprint">Створити спринт</button>
            </div>

    </div>
</template>