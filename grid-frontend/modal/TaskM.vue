<script setup lang="ts">
import { useModal } from '~/hooks/useModal';
import type { Sprint } from '~/types/sprint';
import { TaskDifficulty, type CreateTaskDto, type Task, type UpdateTaskDto } from '~/types/task';
import type { Comment } from '~/types/comment';
import NotifyUser from './NotifyUser.vue';

const props = defineProps<{
    sprintId: string,
    taskId: string,
}>();

const data = ref<{task: Task, sprints: Sprint[], comment: Comment[]} | null>(null);
const emit = defineEmits(['updated'])
const formState = ref();
const notifyUserState = ref(false)
const modal = useModal()

const form = reactive<UpdateTaskDto>({
    title: data.value?.task.title ?? '',
    description: data.value?.task.description ?? '',
    difficulty: data.value?.task.difficulty ?? TaskDifficulty.EASY,
    id_sprint: data.value?.task.id_sprint ?? ''
})

type CommentPayload = {
    text: string
}

const comment = reactive<CommentPayload>({
    text: '' 
})

async function reqTask() {
    try{
        data.value = await $fetch(`http://localhost:8000/task/${props.taskId}/full`,{
            method: 'GET',
            credentials: 'include'
        })
    }catch(error){
        console.error("Виникла помилка при отримані задачі: ", error)
    }
}

watch(data, (newData) => {
    if(!newData) return
    form.title = newData.task.title ?? ''
    form.description = newData.task.description ?? ''
    form.difficulty = newData.task.difficulty ?? ''
    form.id_sprint = newData.task.id_sprint ?? ''
})

onMounted(()=>{
    reqTask()
})

async function updateTask(params: UpdateTaskDto) {
    try{
        formState.value = "Оновлення..."

        await $fetch(`http://localhost:8000/task/${data.value?.task.id}/only`,{
            method: 'PATCH',
            body: form,
            credentials: 'include'
        })

        formState.value = "Завдання успішно оновлено"
        emit('updated')
    }catch(error){
        console.error("Виникла помилка при оновленні задачі: ", error)
    }
}

async function sentComment() {
    try{
        await $fetch(`http://localhost:8000/comment?taskId=${data.value?.task.id}`,{
            method: 'POST',
            body: {
                text: comment.text
            },
            headers: {
                'Content-type': 'application/json'
            },
            credentials: 'include'
        })

        formState.value = "Завдання успішно оновлено"
    }catch(error){
        console.error("Виникла помилка при оновленні задачі: ", error)
    }
}

// const openNotification = (taskId: string) =>{
//     modal.open({
//         component: CreateNotification,
//         props:{
//             projectId,
//             taskId
//         }
//     })
// }

</script>

<template>
    <div class="flex">
        <div v-if="!form.title" class="flex justify-center p-4">
            Завантаження...
        </div>

        <div v-else class="flex">
            <div class="">
                <h1 class="text-[20px] font-bold text-left">About task</h1>
                <form class="flex flex-col p-8 m-3 gap-3" action="submit" @submit.prevent="updateTask(form)">
                    <div class="flex flex-col m-auto">
                        <label class="flex gap-1 items-center p-1">
                            <p class="text-gray-400">Title:</p>
                            <input v-model="form.title" class="p-1" type="text" required>
                        </label>
                        <label class="flex flex-col gap-1 p-1">
                            <p class="text-gray-400">Description:</p>
                            <textarea v-model="form.description" class="border p-1 rounded-[5px]" type="text" required></textarea>
                        </label>
                        <label class="flex gap-1 items-center p-1">
                            <p class="text-gray-400">Difficulty:</p>
                            <select v-model="form.difficulty" class="p-1" required>
                                <option disabled value="">Оберіть складність</option>
                                <option value="EASY">EASY</option>
                                <option value="MEDIUM">MEDIUM</option>
                                <option value="HARD">HARD</option>
                            </select>
                        </label>
                        <label class="flex gap-1 items-center p-1">
                            <p class="text-gray-400">Sprint:</p>
                            <select v-model="form.id_sprint" class="p-1" required>
                                <option disabled value="">Оберіть спринт</option>
                                <option 
                                    v-for="sprint in data?.sprints" 
                                    :key="sprint.id"
                                    :value="sprint.id"
                                >
                                    {{ sprint.title }}
                                </option>
                            </select>
                        </label>
                    </div>
                    <button class="p-2 m-2 bg-green-400 text-white" type="submit">Update</button>
                    <p v-if="formState">{{ formState }}</p>
                </form>
            </div>
            <section class="flex flex-col p-8">
                <p v-if="data?.task.commit">Задача закрита</p>
                <button
                    v-else 
                    class="bg-blue-600 rounded-[5px] text-white m-2 p-2"
                    @click="notifyUserState = !notifyUserState"
                >    
                    Назначити користувача
                </button>
                <NotifyUser 
                    v-if="data?.task && notifyUserState" 
                    class="border-2 p-2"
                    :project-id="data?.task.id_project" 
                    :task="data?.task"
                    :task-difficulty="data?.task.difficulty"
                />
                <div class="border-2 p-2">
                    <form class="flex items-center gap-2" action="submit" @submit.prevent="sentComment">
                        <label>
                            Написати коментар:
                            <input v-model="comment.text" class="border" type="text">
                        </label>
                        <button class="bg-green-400 p-2 text-white">Відправити</button>
                    </form>
                    <hr>
                    <p>Коментарі:</p>
                    <div v-if="data?.comment && data?.comment.length > 0">
                        <div v-for="comment in data.comment">
                            <p>ID: {{ comment.id_user }}</p>
                            <p>{{ comment.text }}</p>
                        </div>
                    </div>
                    <p v-else class="p-2 text-center text-gray-400">--- Коментарів поки немає ---</p>
                </div>
            </section>
        </div>
    </div>
</template>