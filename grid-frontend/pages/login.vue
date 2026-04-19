<script setup lang="ts">

const auth = useAuthStore();

interface LoginForm {
    email: string,
    password: string
}

interface LoginResponse{
    message: string,
    user:{
        id:number,
        name:string,
        email:string
    }
}

const form = reactive<LoginForm>({
    email: '',
    password: ''
})

async function SubmitForm(args: LoginForm){

    const {data, error} = await useFetch<LoginResponse>('http://localhost:8000/auth/login', {
        method: 'POST',
        body: form,
        watch: false,
        credentials: 'include'
    });

    if(error.value){
        console.log("Виникла помилка входу: ", error.value.data)
        alert(error.value.data.message || 'Помилка авторизації')
    } else{
        navigateTo('/');
        auth.fetchUser();
        console.log("Успіх:", data.value?.message)
    }
}

</script>

<template>
    <div class="font-saira shadow-regular m-auto bg-white border-2 border-[black] my-[10%] w-[30%] p-2">
        <h1 class="text-center font-bold text-[25px] text-blue-600">Login</h1>
        <form class="flex flex-col gap-5" @submit.prevent="SubmitForm(form)">
            <label class="flex flex-col m-auto">
                <p>Email:</p>
                <input v-model="form.email" class="border" type="text">
            </label>
            <label class="flex flex-col m-auto">
                <p>Password:</p>
                <input v-model="form.password" class="border" type="password">
            </label>
            <button class="p-3 m-3 bg-green-400">Submit</button>
        </form>
    </div>
</template>