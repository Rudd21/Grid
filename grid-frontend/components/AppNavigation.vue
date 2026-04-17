<script setup lang="ts">
import { useAuthStore } from '#imports';
import { NotificationType } from '~/types/notification';
import AppDrawer from './AppDrawer.vue';
import { useModal } from '~/hooks/useModal';
import TaskM from '~/modal/TaskM.vue';
import CommitM from '~/modal/CommitM.vue';

const route = useRoute();
const projectId = route.params.id;
const auth = useAuthStore();
const profile = ref<any>(null);

let pollingInterval: ReturnType<typeof setInterval> | null = null

const isDrawerOpen = ref(false);
const notificationState = ref(false);
const notifications = ref<Notification | null>(null);

const openDrawer = ()=>{
    isDrawerOpen.value = true
}

async function reqProfile() {
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

async function reqNotification() {
    try{
        notifications.value = await $fetch(`http://localhost:8000/notification/${auth.userId}`,{
            method: 'GET',
            credentials: 'include'
        })
    }catch(error){
        console.error("Виникла помилка запиту сповіщень: ", error)
    }
}

async function makeAsRead(notifId: string) {
    try{
        await $fetch(`http://localhost:8000/notification/${notifId}`,{
            method: 'PATCH',
            credentials: 'include'
        })
    }catch(error){
        console.error("Виникла помилка при позначенні повідомлення як прочитаного: ", error)
    }
}

async function deleteNotification(notifId: string) {
    try{
        await $fetch(`http://localhost:8000/notification/${notifId}`,{
            method: 'DELETE',
            credentials: 'include'
        })
        reqNotification()
    }catch(error){
        console.error('Виникла помилка при видалені сповіщення: ', error)
    }
}

onMounted(()=>{
    if(auth.isInitialized && auth.userId){
        reqProfile();
        reqNotification()
        pollingInterval = setInterval(reqNotification, 1000 * 30);
    }

    watch(() => auth.isInitialized, (initialized)=>{
        if(initialized && auth.userId){
            reqProfile();
            reqNotification()
            pollingInterval = setInterval(reqNotification, 1000 * 30);
        }
    })
})

onUnmounted(()=>{
    if(pollingInterval){
        clearInterval(pollingInterval)
    }
})

const modal = useModal();

const openTask = (projectId: string, taskId: string) =>{
    isDrawerOpen.value = false;
    notificationState.value = false;
    
    modal.open({
        component: TaskM,
        props:{
            projectId,
            taskId
        }
    })
}

const openCommitTask = (taskId: string) => {
    isDrawerOpen.value = false;
    
    modal.open({
        component: CommitM,
        props:{
            taskId
        }
    })
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


</script>

<template>
    <nav
        class="group shadow-regular font-saira bg-[#FFF8F8] mt-3 border-2 border-[black] h-[75px] w-[95%] m-auto p-3"  
    >
        <ul class="flex justify-around items-center">
            <li class="flex items-center gap-5">
                <img class="w-10 h-10" src="/logo.png" alt="">
                <NuxtLink to="/">
                    <h1 class="font-boldonse font-bold text-blue-600">Grid</h1>
                </NuxtLink>
                <div>
                    <a
                        href="/project" 
                        class="font-saira"
                    >My projects</a>
                </div>
            </li>
            <li>
                <div class="flex gap-2 bg-white border p-2 rounded-[15px]">
                    <p class="text-gray-400">Search:</p> 
                    <input class="border-b-2 border-black focus:border-gray-400 transition focus:outline-none" type="text" name="" id="">
                </div>
            </li>
            <li class="flex gap-3">
                <div v-if="!auth.isInitialized">Заватаження...</div>
                
                <nav v-else>
                    <div v-if="auth.user">
                        <div class="font-saira flex gap-3">
                            <button @click="openDrawer()">Profile</button>
                            <button @click="notificationState = true" >Notification</button>
                            <button @click="auth.logout">Logout</button>
                        </div>

                        <!-- Notification bar -->
                        <div 
                            v-if="notificationState"
                            v-for="notification in notifications"
                            class="absolute z-20 flex w-50 right-20 flex-col border bg-white p-5 rounded-[5px]"
                            :class="notifications"
                        >
                            <button 
                                @click="notificationState = false"
                                class="text-red-600"
                            >
                                ✕
                            </button>
                            <div
                                class="p-2" 
                                :class="notification.isRead ? `bg-[#FFF8F8]` : `bg-[#E9DFC3]` "
                            >
                                <div
                                >
                                    <p>{{ notification.type == NotificationType.TASK_RECOMMEND ? "Рекомендація задачі " : "Передача задачі " }}</p>
                                    <p>від: {{ notification.id_sender }}</p>
                                </div>
                                <p>{{ notification.message }}</p>
                                <div class="flex justify-between">
                                    <button 
                                        class="text-blue-600" 
                                        @click="
                                            makeAsRead(notification.id);
                                            openTask(notification.id_project, notification.id_task)
                                        "
                                        >Завдання</button>
                                    <button 
                                        class="p-1 bg-red-500 text-white"
                                        @click="deleteNotification(notification.id)"    
                                    >
                                        Видалити
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div v-else class="flex gap-3">
                        <a href="/login">Login</a>
                        <a href="/register">Register</a>
                    </div>
                </nav>

            </li>
        </ul>
    </nav>

    <AppDrawer :isOpen="isDrawerOpen" @close="isDrawerOpen = false">
        <p>ID: {{ profile.id }}</p>
        <h1>{{ profile.name }}</h1>
        <p>Email: {{ profile.email }}</p>
        <p>Skills: {{ profile.skills }} year</p>
        <h2>Tasks that you taked:</h2>
        <div 
            v-for="task in profile.tasks"
            class="flex justify-between p-2 border"
        >
            <div>
                <button class="text-blue-600" @click="openTask(task.id_project, task.id)">{{ task.title }}</button>
                <p>Difficulty: {{ task.difficulty }}</p>
                <p>Description: {{ task.description }}</p>
            </div>
            <div class="flex flex-col justify-center">
                <button class="p-1 m-1 rounded-[5px] bg-gray-700 text-white" @click="removeTask(task.id_sprint, task.id)">
                    Зняти задачу
                </button>
                <button class="p-1 m-1 rounded-[5px] bg-red-700 text-white">
                    Перекинути задачу
                </button>
                <button class="p-1 m-1 rounded-[5px] bg-blue-600 text-white" @click="openCommitTask(task.id)">
                    Закомітити задачу
                </button>
            </div>
        </div>
        <div class="flex p-2">
            <p class="p-2">Something wrong? you can fix it:</p>
            <NuxtLink 
                class="p-2 bg-blue-600 text-white rounded-[5px]"
                :to="`/profile/${auth.userId}`"
                @click="isDrawerOpen = false"
            >
                Edit profile
            </NuxtLink>
        </div>
    </AppDrawer>

</template>