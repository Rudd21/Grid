<script setup lang="ts">
import type { UpdateUserDto, User } from '~/types/user';

const route = useRoute();

const userId = route.params.id;
const user = ref<User | null>(null);

async function reqProfile() {
    try{
        const responce = await $fetch<User>(`http://localhost:8000/users/${userId}`,{
            method: 'GET',
            credentials: 'include'
        })

        user.value = responce;
    }catch(error){
        console.error('Виникла помилка при запиті профілю')
    }
}

onMounted(()=>{
    reqProfile()
})

const form = reactive<UpdateUserDto>({
    name: '',
    newPassword: '',
    oldPassword: '',
    skills: []
})

async function updateProfile(){
    try{
        await $fetch('http://localhost:8000/users',{
            method: 'PUT',
            body: form,
            credentials: 'include'
        })
    }catch(error){

    }
}

</script>

<template>
    <div class="bg-white flex justify-around border p-1 m-auto w-[60%] h-[80vh] rounded-[10px]">
        <div class="flex flex-col items-center">
            <img src="../public/default-user.png" alt="avatar">
            <button>Завантажити нове фото</button>
        </div>
        <div v-if="user">
            <p>ID: {{ user.id }}</p>
            <h1>Name: {{ user.name }}</h1>
            <p>Email: {{ user.email }}</p>
            <p>Skills: {{ user.skills }}</p>
            <div v-if="user.tasks?.length">
                <h2>Активні взятті завдання:</h2>
                <div
                    v-for="task in user.tasks"
                    class="border p-2"    
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
    </div>
</template>