<script setup lang="ts">
import { useModal } from '~/hooks/useModal';
import TaskM from '~/modal/TaskM.vue';
import type { Task } from '~/types/task';

const profile = ref<any>(null);

// const isDrawerOpen = ref(false);

// const openDrawer = ()=>{
//     isDrawerOpen.value = true
// }

const auth = useAuthStore();

const emit = defineEmits(['close'])

const closeDrawer = () =>{
    emit('close')
}

async function requestProfile() {
    try{
        const responce = await $fetch(`http://localhost:8000/users/${auth.userId}`,{
            method: 'GET',
            credentials: 'include'
        })

        profile.value = responce;
    }catch(error){
        console.error("Виникла помилка запит профілю: ", error)
    }
}

onMounted(()=>{
    requestProfile()
})

const modal = useModal()

const openTask = (task: Task) =>{
    modal.open({
        component: TaskM,
        props:{
            projectId: task.id_project,
            sprintId: task.id_sprint,
            taskId: task.id,
            onUpdated: () => requestProfile()
        }
    })
}



</script>

<template>
    <div v-if="profile">
        <p>ID: {{ profile.id }}</p>
        <h1>{{ profile.name }}</h1>
        <p>Email: {{ profile.email }}</p>
        <p>Skills: {{ profile.skills }} year</p>
        <h2>Tasks that you taked:</h2>
        <div 
            v-for="task in profile.tasks"
            class="flex flex-col justify-between p-2 border"
        >
            <div>
                <button class="text-blue-600" @click="openTask(task)">{{ task.title }}</button>
                <p>Difficulty: {{ task.difficulty }}</p>
                <p>Description: {{ task.description }}</p>
            </div>
            <div class="flex flex-col justify-center">
                <button class="p-1 m-1 rounded-[5px] bg-red-700 text-white">
                    Зняти задачу
                </button>
                <button class="p-1 m-1 rounded-[5px] bg-mySea text-white">
                    Перекинути задачу
                </button>
            </div>
        </div>
        <div class="flex p-2">
            <p class="p-2">Something wrong? you can fix it:</p>
            <NuxtLink 
                class="p-2 bg-blue-600 text-white rounded-[5px]"
                :to="`/profile/${auth.userId}`"
                @click="closeDrawer"
            >
                Edit profile
            </NuxtLink>
        </div>  
    </div> 
    <div v-else>
        <p>Завантаження даних...</p>
    </div>
</template>