<script setup lang="ts">
import type { Project } from '~/types/project';
import type { User } from '~/types/user';


const route = useRoute();

const searchType = ref(route.query.type?.toString());
const searchQuery = ref(route.query.query?.toString() || '');

type SearchType = User[] | Project[];

const {data: results, pending} = useFetch<SearchType>(
    () => {
        return searchType.value === 'user' ? `http://localhost:8000/users` :  `http://localhost:8000/project`
    },{
        params:{
            [searchType.value === 'user' ? 'name' : 'title']: searchQuery
        },
        watch: [searchType, searchQuery],
        immediate: searchQuery.value.length > 0
    }

)

</script>

<template>
    <div class="w-[70%] m-auto mt-10 p-2 shadow-regular bg-myWhite">
        <h1 v-if="pending">
            Пошук...
        </h1>

        <div 
            v-else-if="results && results?.length > 0"
            v-for="item in results"
        >
            <div 
                v-if="'name' in item"
                class="flex border-2 w-[80%] border-myBeige m-auto p-2"
            >
                <div class="flex-grow">
                    <h2 class="bg-myBeige m-1 p-1">{{ item.name }}</h2>
                    <p class="bg-myBeige m-1 p-1">Experience: {{ item.skills }}</p>
                </div>
                <NuxtLink
                    class="flex justify-center items-center w-[100px] m-2 p-1 bg-mySea text-myWhite"
                    :to="`/profile/${item.id}`"
                >
                    Profile
                </NuxtLink>
            </div>

            <div 
                v-else-if="'title' in item"
                class="flex border-2 w-[80%] border-myBeige m-auto p-2"
            >
                <div class="flex-grow">
                    <h2 class="bg-myBeige m-1 p-1">{{ item.title }}</h2>
                    <p class="bg-myBeige m-1 p-1">{{ item.description }}</p>
                </div>
                <NuxtLink
                    class="flex justify-center items-center w-[100px] m-2 p-1 bg-mySea text-myWhite"
                    :to="`/project/${item.id}`"
                >
                    Visit
                </NuxtLink>
            </div>
        </div>
        <h2 
            v-else
            class="text-center"
        >
            Нічого не знайдено
        </h2>
    </div>
</template>