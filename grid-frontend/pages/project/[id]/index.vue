<script setup lang="ts">
import type { Project } from '~/types/project';


const route = useRoute();
const projectId = route.params.id;

const {data: project, error} = useFetch<Project>(
    `http://localhost:8000/project/${projectId}`,
    {
        credentials: 'include'
    }
)

</script>

<template>
    <div class="flex flex-col ml-[300px] flex-grow w-full h-full">
        <h1 class="font-boldonse m-5 text-[30px] text-mySea">About project:</h1>
        <section 
            v-if="project"
            class="flex justify-between items-center w-[50%] m-5 p-3"
        >
            <div>
                <p class="text-gray-400">ID: {{ project.id }}</p>
                <h2 class="text-[30px]">{{ project.title }}</h2>
                <p class="underline">Description: {{ project.description }}</p>
                <p>Status: {{ project.status }}</p>
            </div>
            <div
                v-for="member of project.members"
            >
                <!-- Користувачі -->
            </div>
            <NuxtLink
                class="bg-mySea text-white h-min p-3"
                :to="`/project/${project.id}/task`"
            >
                To Project
            </NuxtLink>
        </section>
        <section
            v-else
        >
            Проєкт є приватним
        </section>
    </div>
</template>