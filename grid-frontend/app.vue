<script setup lang="ts">
import ModalProvider from './provider/ModalProvider.vue';

const auth = useAuthStore();

onMounted(()=>{
  auth.fetchUser();
})
</script>

<template>
  <ModalProvider>
    <div class="flex flex-col min-h-screen bg-[#E9DFC3]">
      <ClientOnly>
        <AppNavigation />
        <template #fallback>
          <div class="group bg-[#FFF8F8] mt-3 border-2 border-[black] h-[75px] w-[95%] rounded-[15px] m-auto p-3"></div>
        </template>
      </ClientOnly>
      <main class="flex-grow">
        <NuxtPage />
        </main>
      <AppFooter />
    </div>
  </ModalProvider>
</template>

<style>
html, body {
  @apply antialiased text-gray-800;
}
main{
  font-family: "Boldonse", sans-serif;
  background-size: 50%;
}
</style>