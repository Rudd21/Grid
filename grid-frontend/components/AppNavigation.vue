<script setup lang="ts">
import { useAuthStore } from '#imports';
import { NotificationType, type Notification } from '~/types/notification';
import AppDrawer from './AppDrawer.vue';
import { useModal } from '~/hooks/useModal';
import TaskM from '~/modal/TaskM.vue';
import CommitM from '~/modal/CommitM.vue';
import ProfileDrawer from './ProfileDrawer.vue';
import { useNotification } from '~/hooks/useNotification';

const route = useRoute();
const projectId = route.params.id ?? '';
const auth = useAuthStore();
const profile = ref<any>(null);

const isDrawerOpen = ref(false);
const searchState = ref(false);

const {
    notificationState,
    notifications,
    openNotification, 
    closeNotification, 
    reqNotification, 
    makeAsRead, 
    deleteNotification,
    startPolling, 
    stopPolling,} = useNotification()


const search = reactive({
    query: ''
})

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

onMounted(()=>{
    reqProfile()
})

onMounted(()=>{
    startPolling()
})

onUnmounted(()=>{
    stopPolling()
})

const modal = useModal();

const openTask = (taskId: string) =>{
    isDrawerOpen.value = false;
    closeNotification()
    
    modal.open({
        component: TaskM,
        props:{
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
                    <input 
                        v-model="search.query"
                        class="border-b-2 border-black focus:border-gray-400 transition focus:outline-none" 
                        @input="searchState = true" 
                        type="text"
                    >

                    <div 
                        v-if="searchState"
                        class="absolute flex flex-col mt-8"
                    >
                        <NuxtLink 
                            class="w-[250px] m-auto p-3 border-2 bg-myWhite hover:bg-mySea hover:text-white transition"
                            @click="searchState = false"
                            :to="`/search?type=user&query=${search.query}`"
                        >
                            Search among users
                        </NuxtLink>
                        <NuxtLink 
                            class="w-[250px] m-auto p-3 border-2 bg-myWhite hover:bg-mySea hover:text-white transition"
                            @click="searchState = false"
                            :to="`/search?type=project&query=${search.query}`"
                        >
                            Search among projects
                        </NuxtLink>
                    </div>
                </div>
            </li>
            <li class="flex gap-3">
                <div v-if="!auth.isInitialized">Заватаження...</div>
                
                <nav v-else>
                    <div v-if="auth.user">
                        <div class="font-saira flex gap-3">
                            <button @click="isDrawerOpen = true">Profile</button>
                            <button @click="openNotification" >Notification</button>
                            <button @click="auth.logout">Logout</button>
                        </div>

                        <!-- Notification bar -->
                        <div
                            v-if="notificationState"
                            class="absolute z-20 flex w-50 right-20 flex-col border bg-white p-5 rounded-[5px]"
                        >
                            <button 
                                @click="closeNotification()"
                                class="text-red-600"
                            >
                                ✕
                            </button>
                            <div
                                v-if="notifications && notifications.length > 0"
                            >
                                <div v-for="notification in notifications">
                                    <div
                                        class="p-2" 
                                        :class="notification.isRead ? `bg-myWhite` : `bg-myBeige` "
                                    >
                                        <div
                                        >
                                            <p>{{ notification.type == NotificationType.TASK_RECOMMEND ? "Рекомендація задачі " : "Передача задачі " }}</p>
                                            <p>від: {{ notification.id_sender }}</p>
                                        </div>
                                        <p>{{ notification.message }}</p>
                                        <div 
                                            v-if="notification.id_task"
                                            class="flex justify-between"
                                        >
                                            <button 
                                                class="text-blue-600" 
                                                @click="
                                                    makeAsRead(notification.id);
                                                    openTask(notification.id_task)
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
                            <div v-else>
                                <h1>Сповіщень немає</h1>
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
        <ProfileDrawer 
            :is-editable="true"
            @close="isDrawerOpen = false"
        />
    </AppDrawer>

</template>