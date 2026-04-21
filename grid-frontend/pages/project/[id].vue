<script setup lang="ts">

const route = useRoute();
const projectId = route.params.id?.toString() ?? '';


// Request projects
const projectList = ref();
const currentProject = ref();


// Bookmark requests


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

// async function deleteProject() {
//     try{
//         await $fetch(`http://localhost:8000/project/${projectId}`, {
//             method: 'DELETE',
//             credentials: 'include'
//         })

//         console.log("Успішно видалено проєкт")
//         navigateTo('/project')
//     }catch(error){
//         console.error('Помилка запиту: ', error)
//     }
// }

type WorkplaceTab = 'task' | 'sprint' | 'members' | 'settings' | 'statistic';

const WORKPLACE_TABS: WorkplaceTab[] = ['task', 'sprint', 'members', 'settings', 'statistic'];

const isWorkplace = computed(()=>{
    const pathSegment = route.path.split('/')

    const currentTab = pathSegment[pathSegment.length - 1] as WorkplaceTab

    return WORKPLACE_TABS.includes(currentTab);
})


</script>

<template>
    <div class="font-saira m-10 flex flex-col h-screen overflow-hidden border-2 border-blue-600/60 rounded-xl">
        <!-- Work place -->
        <div class="flex min-h-[10%] bg-white/60 items-center">
            <NuxtLink 
                class="font-saira flex items-center h-[60%] m-2 text-black px-4 py-2 underline rounded-lg transition-colors shadow-sm"
                to="/project"
            >
                Back to projects
            </NuxtLink>
            |
            <NuxtLink class="font-saira flex p-1 items-center m-2 text-blue-600 hover:text-white hover:bg-blue-600 rounded-[5px] transition" href="/createProject">+ Create Project</NuxtLink>
        </div>

        <!-- Bookmarks -->
        <div>

            <!-- Project bar -->
            <ProjectWorkplace v-if="isWorkplace" :projectId="projectId">
                <NuxtPage />
            </ProjectWorkplace>

            <!-- Work place -->
            <div v-else class="flex-grow h-screen border-t-2 border-blue-600/60 bg-white">
                <NuxtPage />
            </div>
        </div>
    </div>

</template>
