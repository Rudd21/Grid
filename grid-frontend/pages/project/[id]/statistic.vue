<script setup lang="ts">

const route = useRoute()
const projectId = route.params.id;

const stats = ref();

async function reqStats() {
    try{
        const responce = await $fetch(`http://localhost:8000/project/${projectId}/stats`,{
            method: 'GET',
            credentials: 'include'
        })

        stats.value = responce;
    }catch(error){
        console.error("Виникла помилка при вибору статистики проєкту: ", error);
    }
}

onMounted(()=>{
    reqStats()
})

</script>

<template>
    <h1>Статистика по проєкту: </h1>
    <div v-if="stats">
        <h1>Назва проєкту: {{ stats.title }}</h1>
        <p>Кількість спринтів: {{ stats._count.sprints }}</p>
        <p>Кількість задач: {{ stats._count.tasks }}</p>
        <p>Кількість учасників: {{ stats._count.members }}</p>
    </div>
</template>