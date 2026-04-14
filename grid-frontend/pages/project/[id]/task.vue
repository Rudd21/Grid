<script setup lang="ts">
import { io } from 'socket.io-client';
import { VueDraggable } from 'vue-draggable-plus';
import { useModal } from '~/hooks/useModal';
import CreateNotification from '~/modal/CreateNotification.vue';
import CreateSprint from '~/modal/CreateSprint.vue';
import CreateTask from '~/modal/CreateTask.vue';
import TaskM from '~/modal/TaskM.vue';
import type { Sprint } from '~/types/sprint';
import type { Task } from '~/types/task';

type Status = 'TODO' | 'DOING' | 'DONE'

const route = useRoute();
const projectId = route.params.id;
const sprint = ref<Sprint | null>(null);

const auth = useAuthStore();

const columns = ref<Record<Status, Task[]>>({
    TODO: [],
    DOING: [],
    DONE: []
})

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

watchEffect(() => {
  if (!sprint.value?.tasks) return

  columns.value = {
    TODO: sprint.value.tasks.filter(t => t.status === 'TODO') ?? [],
    DOING: sprint.value.tasks.filter(t => t.status === 'DOING') ?? [],
    DONE: sprint.value.tasks.filter(t => t.status === 'DONE') ?? []
  }
})

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
        await $fetch(`http://localhost:8000/task/${taskId}/take`,{
            method: 'PATCH',
            credentials: 'include'
        })
    }catch(error){
        console.error("Виникла помилка при взятті задачі: ", error);
    }
}

async function removeTask(sprintId: string, taskId: string) {
    try{
        await $fetch(`http://localhost:8000/task/${taskId}/take`,{
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

const openNotification = (taskId: string) =>{
    modal.open({
        component: CreateNotification,
        props: {
            projectId,
            taskId
        }
    })
}

const openTask = (task: Task) =>{
    modal.open({
        component: TaskM,
        props:{
            projectId: projectId,
            sprintId: task.id_sprint,
            taskId: task.id,
            title: task.title,
            description: task.description,
            difficulty: task.difficulty,
            onUpdated: () => requestSprint()
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

                    <div class="flex justify-between gap-3">
                        <h1>Спринт: {{ sprint.title }}</h1>
                        <div class="flex justify-start gap-3">
                            <p>Початок: {{ formatDate(sprint.start_date) }}</p>
                            <p>Кінець: {{ formatDate(sprint.end_date) }}</p>
                        </div>
                    </div>
                    <div
                        class="flex p-2 border rounded bg-gray-50"
                    >
                        <div
                        v-for="(tasks, status) in columns"
                        :key="status"
                        class="border w-[300px] m-2 p-2"
                        >
                            <h3 class="text-center">{{ status }}</h3>
                            <hr>
                            <pre>{{ columns }}</pre>
                            <VueDraggable
                                v-model="columns[status as Status]"
                                group="tasks"
                                item-key="id"
                            >
                                <template #item="{ element: task }">
                                    <div class="flex justify-between border mt-2 p-2">
                                        {{ task.title }}
                                        <div>
                                        <h4>{{ task.title }}</h4>
                                        <p class="text-gray-400">{{ task.difficulty }}</p>
                                        </div>
                                        <button
                                        @click="openTask(task)"
                                        class="text-[25px] w-min text-gray-400"
                                        >
                                        •••
                                        </button>
                                    </div>
                                </template>
                            </VueDraggable>
                        </div>
                    </div>

                    <!-- <p v-if="!sprint.tasks?.length" class="text-center text-[25px] text-gray-400 m-10">У цьому спринті немає ще задач</p>
                    <button 
                        class="flex items-center p-2 m-2 bg-green-400 text-white" 
                        @click="openCreateTask(sprint.id)"
                    >    
                        + Додати нову задачу
                    </button> -->
                </div>
            </div>

            <div v-else="!sprint">
                <h1>Спринтів немає, створіть</h1>
                <button class="p-2 m-3 text-white bg-green-400" @click="openCreateSprint">Створити спринт</button>
            </div>

    </div>
</template>