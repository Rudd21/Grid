<script setup lang="ts">
import type { CreateSprintDto, Sprint } from '~/types/sprint';

const props = defineProps<{
    title: string,
    start_date: string,
    end_date: string,
    sprintId: string;
}>();

const emit = defineEmits(['updated'])

const route = useRoute()
const projectId = route.params.id as string;
const sprint = ref<Sprint | null>(null);
const formState = ref();

async function reqSprint() {
    try{
        sprint.value = await $fetch(`http://localhost:8000/sprint/${props.sprintId}`,{
            method: 'GET',
            credentials: 'include'
        })
    }catch(error){
        console.error("Виникла помилка при запиті спринту: ", error);
    }
}

onMounted(()=>{
    reqSprint();
})

const form = reactive<CreateSprintDto>({
    title: props.title ?? '', 
    start_date: props.start_date?.split('T')[0] ?? '', 
    end_date: props.end_date?.split('T')[0] ?? '', 
})

async function sentForm() {
    try{
        formState.value = 'Оновлюється...'
        await $fetch(`http://localhost:8000/sprint/${sprint.value?.id}`,{
            method: 'PATCH',
            body: form,
            credentials: 'include'
        })
        formState.value = 'Успішно відправлено'
        emit('updated')
    }catch(error){
        console.error("Виникла помилка при оновленні спринта: ", error)
        formState.value = 'Виникла помилка при відправлені'
    }
}

</script>

<template>
    <div class="flex">
        <section class="m-5">
            <h2>Про спринт: </h2>
            <p>{{ sprint?.id }}</p>
            <p>{{ sprint?.title }}</p>
            <div v-if="sprint?.start_date && sprint?.end_date">
                <p>Початок: {{ formatDate( sprint.start_date )}}</p>
                <p>Кінець: {{ formatDate( sprint.end_date )}}</p>
            </div>
            <bdi></bdi>
            <h2>Задачі спринта: </h2>
            <div 
                v-for="task in sprint?.tasks"
                class="border-2 m-2 p-1"    
            >
                <p>Задача: {{ task.title }}</p>
                <p>Складність: {{ task.difficulty }}</p>
                <p class="p-1">
                    {{ task.user ? "Взята" : "Не взята" }}
                </p>
            </div>
        </section>
        <form class="flex flex-col m-5 justify-between" action="submit" @submit.prevent="sentForm()">
            <h2>Налаштування спринту:</h2>
            <label>
                Змінити назву:
                <input v-model="form.title" type="text" name="" id="">
            </label>
            <label>
                Змінити дату початку:
                <input v-model="form.start_date" type="date" name="" id="">
            </label>
            <label>
                Змінити дату кінця:
                <input v-model="form.end_date" type="date" name="" id="">
            </label>
            <button class="p-2 bg-green-400">Оновити</button>
            <p v-if="formState">{{ formState }}</p>
        </form>
</div>
</template>