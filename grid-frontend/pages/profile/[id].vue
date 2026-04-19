<script setup lang="ts">
import type { CrossProject } from '~/types/project';
import type { User } from '~/types/user';

const route = useRoute();

const auth = useAuthStore();
const userId = route.params.id;

const profileState = ref('');
const passwordState = ref('');
const toUpdatePassword = ref(false);

const {data: profile, error} = await useFetch<{user: User, crossProjects: CrossProject[] } | null>(
    ()=>`http://localhost:8000/users/${userId}/profile`,
    {
        method: 'GET',
        credentials: 'include'
    }
)

const form = reactive({
    name: profile.value?.user.name ?? '',
    skills:  profile.value?.user.skills ?? 1,
})

const passwordForm = reactive({
    newPassword: '',
    oldPassword: ''
})

watch(profile, (newUser) => {
    if(!newUser) return
    form.name = newUser.user.name ?? ''
    form.skills = newUser.user.skills ?? 1
})

async function updateProfile(){
    try{
        await $fetch('http://localhost:8000/users',{
            method: 'PUT',
            body: form,
            credentials: 'include'
        })
    }catch(error){
        console.error("Невдалося оновити профіль")
    }
}

async function updatePassword(){
    try{
        await $fetch('http://localhost:8000/users',{
            method: 'PATCH',
            body: passwordForm,
            credentials: 'include'
        })
    }catch(error){
        console.error("Невдалося оновити профіль")
    }
}

</script>

<template>
    <div class="bg-white flex flex-col justify-start border p-1 mt-10 m-auto shadow-regular w-[60%]">
        <div v-if="profile" class="grid grid-cols-2  gap-2 items-center">
            <div class="flex flex-col items-center">
                <img src="../public/default-user.png" alt="avatar">
                <button v-if="auth.userId == userId">Завантажити нове фото</button>
            </div>
            <div>
                <div v-if="auth.userId == userId" class="h-15">
                    <label>
                        Оновити пароль:
                        <input @click="toUpdatePassword = !toUpdatePassword" type="checkbox">
                    </label>
                    <form v-if="toUpdatePassword" class="flex flex-col gap-2" action="submit" @submit.prevent="updatePassword">
                        <label class="flex gap-1">
                            <p class="text-gray-400">Old Password:</p>
                            <input v-model="passwordForm.oldPassword" type="string">
                        </label>
                        <label class="flex gap-1">
                            <p class="text-gray-400">New Password:</p>
                            <input v-model="passwordForm.newPassword" type="string">
                        </label>
                        <button class="p-2 bg-blue-600 text-white">Оновити пароль</button>
                    </form>
                    <form v-else class="flex flex-col gap-2" action="submit" @submit.prevent="updateProfile">
                        <label class="flex gap-1">
                            <p class="text-gray-400">ID:</p> {{ profile.user.id }}
                        </label>
                        <label class="flex gap-1">
                            <p class="text-gray-400">Name:</p>
                            <input v-model="form.name" type="text">
                        </label>
                        <label class="flex gap-1">
                            <p class="text-gray-400">Skills:</p>
                            <input v-model="form.skills" type="number" width="min">
                        </label>
                        <button class="p-2 bg-green-400 text-white">Оновити</button>
                    </form>
                </div>

                <div v-else class="flex flex-col gap-2">
                    <p><span class="text-gray-400">ID:</span> {{ profile.user.id }}</p>
                    <p><span class="text-gray-400">Name:</span> {{ profile.user.name }}</p>
                    <p><span class="text-gray-400">Skills:</span> {{ profile.user.skills }} years</p>
                </div>
            </div>
        </div>
        <div v-if="profile && auth.userId == userId">
           <div v-if="profile.user.tasks?.length">
                <h2 class="ml-5">Активні взятті завдання:</h2>
                <div
                    v-for="task in profile?.user.tasks"
                    class="border p-2 m-3"    
                >
                    <p>ID: {{ task.id }}</p>
                    <p>Title: {{ task.title }}</p>
                    <p>Difficulty: {{ task.difficulty }}</p>
                    <NuxtLink 
                        :to="`project/${task.id_project}/task`"
                        class="text-blue-600"
                    >
                        Project
                    </NuxtLink>
                </div>
            </div>
        </div>
        <div 
            v-if="auth.userId != userId && profile?.crossProjects"
            class="ml-10"
        >
            <h3>Спільні проєкти:</h3>
            <div v-for="project in profile.crossProjects">
                <NuxtLink>{{ project.title }}</NuxtLink>
            </div>
        </div>
    </div>
</template>