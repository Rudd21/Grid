<script setup lang="ts">

const route = useRoute();
const projectId = route.params.id;

// Request projects
const projectList = ref();
const currentProject = ref();


// Bookmark requests
interface Bookmark{
    title: string;
    to: string;
    reqTo: string;
}

const bookmarkList: Record<string, Bookmark> = {
    sprint:{
        title: 'Sprint',
        to: '/sprint',
        reqTo: '/reqSprints'
    }, task:{
        title: 'Task',
        to: '/task',
        reqTo: '/reqTasks'
    }, statistic:{
        title: 'Statistic',
        to: '/statistic',
        reqTo: '/reqStatistic'
    }, members:{
        title: 'Members',
        to: '/members',
        reqTo: '/reqMembers'
    }
}

const currentData = ref()
const isLoading = ref(false);

// async function bookmarkRequest(endPoint: string) {
//     isLoading.value = true
//     try{
//         const response = await $fetch(`http://localhost:8000/api${endPoint}`,{
//             credentials: 'include'
//         });

//         currentData.value = response;
//     }catch(error){
//         console.error('Помилка запиту', error)
//     }finally{
//         isLoading.value = false;
//     }
// }

async function deleteProject() {
    try{
        await $fetch(`http://localhost:8000/project/${projectId}`, {
            method: 'DELETE',
            credentials: 'include'
        })

        console.log("Успішно видалено проєкт")
        navigateTo('/project')
    }catch(error){
        console.error('Помилка запиту: ', error)
    }
}


</script>

<template>
    <div class="m-5 flex flex-col h-screen overflow-hidden border-2 border-blue-600 rounded-xl">
        <!-- Work place -->
        <div class="flex min-h-[10%] bg-white items-center">
            <NuxtLink 
                class="bg-white h-[60%] m-2 text-black px-4 py-2 underline rounded-lg transition-colors shadow-sm"
                to="/project"
            >
                Back to projects
            </NuxtLink>
            |
            <NuxtLink class="flex p-1 items-center m-2 text-[#D96868] hover:text-white hover:bg-[#D96868] rounded-[5px] transition" href="/createProject">+ Create Project</NuxtLink>
        </div>

        <!-- Bookmarks -->
        <div class="flex flex-grow">

            <!-- Project bar -->
            <div class="min-w-[20%] bg-blue-600">
                <div class="flex flex-col gap-5 m-5">
                    <NuxtLink
                        v-for="(item, key) in bookmarkList"    
                        :key="key"
                        :to="`/project/${projectId}${item.to}`"
                        :disabled="!currentProject"
                        :class="[currentProject === '' ? '' : 'hover:text-[#D96868]']" 
                        class="cursor-pointer text-center bg-white p-2 rounded-[10px] transition-color disabled:text-gray-400 disabled:bg-gray-200 transistion"
                    >
                        {{ item.title }}
                    </NuxtLink>

                    <button class="cursor-pointer text-red-600 text-center bg-white p-2 rounded-[10px] transition-color disabled:text-gray-400 disabled:bg-gray-200 transistion" 
                            @click="deleteProject">Delete project</button>
                </div>
            </div>

            <!-- Work place -->
            <div class="flex-grow border-t-2 border-blue-600 bg-white">
                <NuxtPage />
            </div>
        </div>
    </div>

</template>