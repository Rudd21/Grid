<script setup lang="ts">
import AppDrawer from './AppDrawer.vue';

const isDrawerOpen = ref(false)

const openDrawer = ()=>{
    isDrawerOpen.value = true
}

const auth = useAuthStore();

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
        <h2>Hello</h2>
        <p>world</p>
    </AppDrawer>

</template>