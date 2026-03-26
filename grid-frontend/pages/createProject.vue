<script setup lang="ts">

interface ProjectForm {
    title: string,
    description: string,
    status: string
}

const form = reactive<ProjectForm>({
    title: '',
    description: '',
    status: ''
})

interface ProjectResponse{
    message: string,
    projetc:{
        title:string,
        status:string
    }
}

async function createProject(args: ProjectForm) {
    const response = await $fetch('http://localhost:8000/project', {
        method: 'POST',
        body: form,
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
        } as Record<string, string>
    });
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
                <input v-model="form.status" type="text">
            </label>
            <button class="bg-green-400 p-2 w-[30%]" type="submit">Create</button>
        </form>
    </div>
</template>