<script setup lang="ts">
import type { Member } from '~/types/member';


const members = ref()

const route = useRoute();
const projectId = route.params.id;

async function reqMembers(){
    try{
        const responce = await $fetch<Member[]>(`http://localhost:8000/project/${projectId}/members`,{
            method: 'GET',
            credentials: 'include'
        })
        
        members.value = responce

    }catch(error){
        console.error('Виникла помилка: ', error)
    }
}

onMounted(()=>{
    reqMembers()
})

</script>

<template>
    <h1>Учасники проєкту:</h1>
    <div class="flex p-2 w-[95%] m-auto bg-gray-200 justify-around rounded-[5px]" v-for="member in members">
        <h1>{{ member.user.name }}</h1>
        <p
        :class="member.role == 'OWNER' || 'MANAGER' ? 'text-red-500' : 'text-gray-500'"
        >{{ member.role }}</p>
        <p>Email: {{ member.user.email }}</p>
    </div>
</template>