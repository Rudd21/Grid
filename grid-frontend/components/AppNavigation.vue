<script setup lang="ts">
import { useAuthStore } from '#imports';
import AppDrawer from './AppDrawer.vue';

const auth = useAuthStore();
const profile = ref<any>(null);

const isDrawerOpen = ref(false)

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

onMounted(()=>{
    if(auth.isInitialized && auth.userId){
        reqProfile();
    }

    watch(() => auth.isInitialized, (initialized)=>{
        if(initialized && auth.userId){
            reqProfile();
        }
    })
})


interface NavigationList {
    nav1: string;
    nav2: string;
    nav3: string;
    nav4: string;
}

const navigationMap: Record<string, NavigationList>={
    project:{
        nav1: 'Project',
        nav2: 'Tasks',
        nav3: 'Statistic',
        nav4: 'Members',
    }
}

const activeNav =  ref('project');

const currentNav = computed(()=> navigationMap[activeNav.value])

</script>

<template>
    <nav
        class="group border-2 border-[black] m-1 border- font-[Open Sans] p-3"
        @mouseleave="activeNav = 'none'"    
    >
        <ul class="flex justify-around items-center">
            <li class="flex items-center gap-5">
                <img class="w-10 h-10" src="/logo.png" alt="">
                <h1 class="font-bold text-blue-600">Grid</h1>
                <div>
                    <a
                        href="/project"
                        :class="['group p-3 rounded-[5px] transition', activeNav === 'project' ? 'text-[#FF7F11]' : 'hover:text-[#FF7F11]']" 
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
                    <div v-if="auth.user" class="flex gap-3">
                        <button @click="openDrawer">Profile</button>
                        <button @click="auth.logout">Logout</button>
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
            >
                Edit profile
            </NuxtLink>
        </div>
    </AppDrawer>

</template>