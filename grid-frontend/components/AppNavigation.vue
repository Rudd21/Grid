<script setup lang="ts">
import { useAuthStore } from '#imports';
import { NotificationType } from '~/types/notification';
import AppDrawer from './AppDrawer.vue';

const route = useRoute();
const projectId = route.params.id;
const auth = useAuthStore();
const profile = ref<any>(null);

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
        console.error("Виникла помилка запит профілю")
    }
}

async function reqNotification() {
    try{
        notifications.value = await $fetch(`http://localhost:8000/notification/${auth.userId}`,{
            method: 'GET',
            credentials: 'include'
        })
    }catch(error){
        console.error("Виникла помилка запиту сповіщень")
    }
}

onMounted(()=>{
    if(auth.isInitialized && auth.userId){
        reqProfile();
        reqNotification()
    }

    watch(() => auth.isInitialized, (initialized)=>{
        if(initialized && auth.userId){
            reqProfile();
            reqNotification()
        }
    })
})

async function makeAsRead() {
    try{

    }catch(error){
        console.error("Виникла помилка при позначенні повідомлення як прочитаного")
    }
}

</script>

<template>
    <nav
        class="group border-2 border-[black] h-[75px] m-1 border- font-[Open Sans] p-3"  
    >
        <ul class="flex justify-around items-center">
            <li class="flex items-center gap-5">
                <img class="w-10 h-10" src="/logo.png" alt="">
                <h1 class="font-bold text-blue-600">Grid</h1>
                <div>
                    <a
                        href="/project" 
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
                        <div class="flex gap-3">
                            <button @click="openDrawer()">Profile</button>
                            <button @click="notificationState = true" >Notification</button>
                            <button @click="auth.logout">Logout</button>
                        </div>

                        <!-- Notification bar -->
                        <div 
                            v-if="notificationState"
                            class="absolute z-20 flex w-50 right-20 flex-col border bg-white p-5 rounded-[5px]"
                        >
                            <button 
                                @click="notificationState = false"
                                class="text-red-600"
                            >
                                ✕
                            </button>
                            <div v-for="notification in notifications">
                                <div>
                                    <p>{{ notification.type == NotificationType.TASK_RECOMMEND ? "Рекомендація задачі " : "Передача задачі " }}</p>
                                    <p>від: {{ notification.id_sender }}</p>
                                </div>
                                <p>{{ notification.message }}</p>
                                <NuxtLink 
                                    class="text-blue-600" 
                                    :to="`${notification.id_task}/task`"
                                    @click="makeAsRead()"
                                    >Завдання</NuxtLink>
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
        <p>Skills: {{ profile.skills }}</p>
        <h2>Tasks that you taked:</h2>
        <div 
            v-for="task in profile.tasks"
            class="flex justify-between p-2 border"
        >
            <div>
                <p>title: {{ task.title }}</p>
                <p>Difficulty: {{ task.difficulty }}</p>
                <p>Description: {{ task.description }}</p>
            </div>
            <div class="flex flex-col justify-center">
                <button class="p-1 m-1 rounded-[5px] bg-gray-700 text-white">
                    Зняти задачу
                </button>
                <button class="p-1 m-1 rounded-[5px] bg-red-700 text-white">
                    Перекинути задачу
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