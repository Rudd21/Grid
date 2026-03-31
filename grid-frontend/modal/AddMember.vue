<script setup lang="ts">
import type { CreateMemberDto } from '~/types/member';

const props = defineProps<{projectId: string}>();
let responce = ref();

const form = reactive<CreateMemberDto>({
    email: '',
})

async function addMember(params: CreateMemberDto) {
    try{
        await $fetch(`http://localhost:8000/project/${props.projectId}/members`,{
            method: 'POST',
            body: form,
            credentials: 'include'
        })

        responce.value = 'Користувача додано!'
    }catch(error){
        console.log("Виникла помилка при додаванні користувача в проєкт: ", error)
        responce.value = 'Невдалося додати користувача'
    }
}

</script>

<template>
    <div class="flex flex-col p-3 m-1">
        <h1 class="text-center">Додати користувача до проєкту: </h1>
        <form class="flex flex-col p-1 m-1" action="submit" @submit.prevent="addMember(form)">
            <label class="flex flex-col">
                Email користувача:
                <input class="border-gray-300 m-1 p-2" v-model="form.email" type="email">
            </label>
            <button class="m-1 p-2 bg-green-400 rounded-[5px]" type="submit">Додати користувача</button>
        </form>
        <p v-if="responce">{{ responce.value }}</p>
    </div>
</template>