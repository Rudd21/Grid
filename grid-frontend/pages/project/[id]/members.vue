<script setup lang="ts">
import { useModal } from '~/hooks/useModal';
import AddMember from '~/modal/AddMember.vue';
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

const modal = useModal();

const openModal = () => {
    modal.open({
        component: AddMember,
        props: {
            projectId: projectId
        }
    })
}

</script>

<template>
    <div class="p-2 w-[95%] m-auto">
        <h1>Учасники проєкту:</h1>
        <div class="flex p-2 m-auto mb-2 bg-gray-200 justify-around rounded-[5px]" v-for="member in members">
            <h1>{{ member.user.name }}</h1>
            <p
            :class="member.role == 'OWNER' ? 'text-red-500' : 'text-gray-500'"
            >{{ member.role }}</p>
            <p>Email: {{ member.user.email }}</p>
        </div>
        <button class="mt-2 p-2 bg-green-300" @click="openModal">+ Добавити користувача</button>
    </div>
</template>