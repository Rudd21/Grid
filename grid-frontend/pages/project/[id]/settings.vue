<script setup lang="ts">
import { ProjectStatus, type CreateProjectDto, type Project } from '~/types/project';

const route = useRoute()
const projectId = route.params.id;

const settings = ref<Project>();

let form: CreateProjectDto;

async function reqProject() {
    try{
        const responce = await $fetch<Project>(`http://localhost:8000/project/${projectId}`,{
            method: 'GET',
            credentials: 'include'
        })

        settings.value = responce;

        form = reactive<CreateProjectDto>({
            title: `${responce.title}`,
            description: `${responce.description}`,
            status: `${responce.status}` as ProjectStatus
        })

    }catch(error){
        console.error("Виникла помилка при запиті проєкту: ", error);
    }
}

async function updateProject(args: CreateProjectDto){
    try{
        await $fetch<CreateProjectDto>(`http://localhost:8000/project/${projectId}/update`,{
            method: 'PUT',
            body: form,
            credentials: 'include'
        })
    }catch(error){
        console.error("Виникла помилка при оновленні проєкту: ", error);
    }
}

onMounted(()=>{
    reqProject()
})

</script>

<template>
    <div>
        <h1>Налаштування проєкту</h1>
        <div>

            <form v-if="settings" class="flex flex-col justify-center items-center gap-3 p-2" @submit.prevent="updateProject(form)" action="">
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
    </div>
</template>