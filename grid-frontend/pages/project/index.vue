<script setup lang="ts">

// Request projects
const projectList = ref();
const currentProject = ref();

interface ProjectShort{
    id: number | string,
    title: string,
}

interface FoundProjects{
    message: string,
    data: ProjectShort[],
}

async function reqProjects() {
    try{
        const projects = await $fetch<FoundProjects>('http://localhost:8000/project/my',{
            'method': 'GET',
            'credentials': 'include'
        })

        projectList.value = projects;
    }catch(error){
        console.error('Виникла помилка:', error);
    }finally{

    }
}

onMounted(()=>{
    reqProjects();
})

// Bookmark requests
interface Bookmark{
    title: string;
    reqTo: string;
}

const bookmarkList: Record<string, Bookmark> = {
    sprint:{
        title: 'Sprint',
        reqTo: '/reqSprints'
    }, task:{
        title: 'Task',
        reqTo: '/reqTasks'
    }, statistic:{
        title: 'Statistic',
        reqTo: '/reqStatistic'
    }, members:{
        title: 'Members',
        reqTo: '/reqMembers'
    }
}

const currentData = ref()
const isLoading = ref(false);

async function bookmarkRequest(endPoint: string) {
    isLoading.value = true
    try{
        const response = await $fetch(`http://localhost:8000/api${endPoint}`,{
            credentials: 'include'
        });

        currentData.value = response;
    }catch(error){
        console.error('Помилка запиту', error)
    }finally{
        isLoading.value = false;
    }
}



</script>

<template>
    <div class="m-5 flex flex-col h-screen overflow-hidden">
        <div class="flex flex-col bg-white items-center min-h-[50vh] w-[20%] m-auto border-2 border-blue-600 rounded-xl">
            <NuxtLink
                v-for="project in projectList" 
                :key="project.id"
                @click="currentProject = project.id"
                :class="[currentProject === project.id ? 'underline' : 'hover:bg-blue-600 hover:text-white']" 
                class="bg-white m-2 text-black px-4 py-2 rounded-lg transition-colors shadow-sm"
                :to="`/project/${project.id}`"
            >
                {{ project.title }}
            </NuxtLink>
            <NuxtLink class="flex p-1 items-center m-2 text-blue-600 hover:text-white hover:bg-blue-600 rounded-[5px] transition" href="/createProject">+ Create Project</NuxtLink>
        </div>
    </div>

</template>