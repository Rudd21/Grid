<script setup lang="ts">
const modal = useModalStore()
</script>

<template>
    <footer>
        <ul class="flex bg-[#FFF8F8] border border-[black] p-2 m-1 justify-around items-center">
            <li class="flex items-center gap-5">
                <img class="w-10 h-10" src="/logo.png" alt="">
                <h1 class="font-bold text-blue-600">Grid</h1>
            </li>
            <li>
                <button @click="modal.open()">Support</button>
            </li>
        </ul>
    </footer>
</template>