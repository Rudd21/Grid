<script setup lang="ts">
import type { CrossProject } from '~/types/project';
import type { UpdateUserDto, User } from '~/types/user';

const route = useRoute();

const auth = useAuthStore();
const userId = route.params.id;
const data = ref<{user: User, crossProjects: CrossProject[] } | null>(null);

async function reqProfile() {
    try{
        data.value = await $fetch(`http://localhost:8000/users/${userId}`,{
            method: 'GET',
            credentials: 'include'
        })

        console.log(data.value)
    }catch(error){
        console.error('Виникла помилка при запиті профілю')
    }
}

onMounted(()=>{
    reqProfile()
})

const form = reactive<UpdateUserDto>({
    name: data.value?.user.name ?? '',
    skills:  data.value?.user.skills ?? 1,
    newPassword: '',
    oldPassword: ''
})

watch(data, (newUser) => {
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

</script>

<template>
    <div class="bg-white flex flex-col justify-start border p-1 m-auto w-[60%] h-[80vh] rounded-[10px]">
        <div v-if="data" class="flex justify-around items-center">
            <div class="flex flex-col items-center">
                <img src="../public/default-user.png" alt="avatar">
                <button v-if="auth.userId == userId">Завантажити нове фото</button>
            </div>
            <div>
                <form v-if="auth.userId == userId" class="flex flex-col gap-2" action="submit" @submi.prevent="">
                    <label class="flex gap-1">
                        <p class="text-gray-400">ID:</p> {{ data.user.id }}
                    </label>
                    <label class="flex gap-1">
                        <p class="text-gray-400">Name:</p>
                        <input v-model="form.name" type="text">
                    </label>
                    <label class="flex gap-1">
                        <p class="text-gray-400">Skills:</p>
                        <input v-model="form.skills" type="number" width="min">
                    </label>
                    <label class="flex gap-1">
                        <p class="text-gray-400">Old Password:</p>
                        <input v-model="form.oldPassword" type="string">
                    </label>
                    <label class="flex gap-1">
                        <p class="text-gray-400">New Password:</p>
                        <input v-model="form.newPassword" type="string">
                    </label>
                    <button class="p-2 bg-green-400 text-white">Оновити</button>
                </form>

                <div v-else class="flex flex-col gap-2">
                    <p><span class="text-gray-400">ID:</span> {{ data.user.id }}</p>
                    <p><span class="text-gray-400">Name:</span> {{ data.user.name }}</p>
                    <p><span class="text-gray-400">Skills:</span> {{ data.user.skills }} years</p>
                </div>
            </div>
        </div>
        <div v-if="data && auth.userId == userId">
           <div v-if="data.user.tasks?.length">
                <h2 class="ml-5">Активні взятті завдання:</h2>
                <div
                    v-for="task in data?.user.tasks"
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
        <div v-if="auth.userId != userId && data?.crossProjects">
            <h3>Спільні проєкти:</h3>
            <div v-for="project in data.crossProjects">
                <p>{{ project.title }}</p>
            </div>
        </div>
    </div>
</template>