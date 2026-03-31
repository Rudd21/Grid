<script setup lang="ts">
import { ProjectStatus, type CreateProjectDto } from '~/types/project';

const form = reactive<CreateProjectDto>({
    title: '',
    description: '',
    status: ProjectStatus.PLANNED
})

async function createProject(args: CreateProjectDto) {
    try{
        await $fetch<CreateProjectDto>('http://localhost:8000/project', {
            method: 'POST',
            body: form,
            credentials: 'include'
        });
    }catch(error){
        console.error("Виникла помилка при ")
    }
}

</script>

<template>
    <div class="bg-white m-auto my-[10%] w-[30%]">
        <h1 class="w-[40%] text-center p-1 text-[#FF7F11] bg-white">Create project form</h1>
        <form class="flex flex-col justify-center items-center gap-3 p-2" @submit.prevent="createProject(form)" action="">
            <label for="">
                <p>Project title:</p>
                <input v-model="form.title" type="text">
            </label>
            <label for="">
                <p>Project description:</p>
                <input v-model="form.description" type="text">
            </label>
            <label for="">
                <p>Project status:</p>
                <select v-model="form.status"  name="status" id="">
                    <option value="PLANNED">PLANNED</option>
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="CLOSED">CLOSED</option>
                </select>
            </label>
            <button class="bg-green-400 p-2 w-[30%]" type="submit">Create</button>
        </form>
    </div>
</template>