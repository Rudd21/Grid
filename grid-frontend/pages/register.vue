<script setup lang="ts">

interface RegisterForm {
    email: string;
    name: string;
    password: string;
    passwordConfirmation: string;
}

const form = reactive<RegisterForm>({
    email: '',
    name: '',
    password: '',
    passwordConfirmation: ''
});

async function submitForm(args: RegisterForm){
    if(args.password != args.passwordConfirmation){
        console.log("Паролі не співпадають")
        return;
    }
    
    type RegisterRequest = Omit<RegisterForm, 'PasswordConfirmation'>

    const payload = {
        email: args.email,
        name: args.name,
        password: args.password
    }

    const {data, error} =await useFetch('http://localhost:8000/users', {
        method: 'POST',
        body: payload,
    })
}

</script>

<template>
    <div class="bg-white border border-2 border-black m-auto my-[10%] w-[30%] p-2">
        <h1 class="text-center font-bold text-[25px] text-blue-600">Register form</h1>
        <form class="flex flex-col gap-5" @submit.prevent="submitForm(form)">
            <label class="flex flex-col m-auto">
                <p>Email:</p>
                <input v-model="form.email" name="Email" class="border" type="email" required>
            </label class="flex flex-col m-auto">
            <label class="flex flex-col m-auto">
                <p>Name:</p>
                <input v-model="form.name" class="border" type="text" required>
            </label>
            <label class="flex flex-col m-auto">
                <p>Password:</p>
                <input v-model="form.password" class="border" type="password" required>
            </label>
            <label class="flex flex-col m-auto">
                <p>Repeat password:</p>
                <input v-model="form.passwordConfirmation" class="border" type="password">
            </label>
            <button class="p-3 bg-green-400 disable:">Submit</button>
        </form>
    </div>
</template>