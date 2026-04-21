<script setup lang="ts">

const props = defineProps<{
    projectId: string
}>();

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
    }, settings:{
        title: 'Settings',
        to: '/settings',
        reqTo: '/settings'
    }
}

</script>

<template>
    <div class="flex h-screen overflow-hidden bg-blue-600/60">
        <!-- Project bar -->
        <div class="min-w-[25%]">
            <div class="flex flex-col">
                <NuxtLink
                    v-for="(item, key) in bookmarkList"    
                    :key="key"
                    :to="`/project/${props.projectId}${item.to}`"
                    class=" flex items-center cursor-pointer text-left text-[20px] min-h-[50px] transition-color disabled:text-gray-400 disabled:bg-gray-200 hover:bg-blue-600 transition"
                >
                    <p class="font-boldonse ml-2 text-white">{{ item.title }}</p>
                </NuxtLink>
            </div>
        </div>
        <div class="flex-grow h-screen border-t-2 border-blue-600/60 bg-white">
            <slot />
        </div>
    </div>
</template>