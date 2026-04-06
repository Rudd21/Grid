<script setup lang="ts">
import ModalProvider from './provider/ModalProvider.vue';

const auth = useAuthStore();

onMounted(()=>{
  auth.fetchUser();
})
</script>

<template>
  <ModalProvider>
    <div class="flex flex-col min-h-screen">
      <ClientOnly>
        <AppNavigation />
        <template #fallback>
          <div class="group border-2 border-[black] h-[75px] m-1 border- font-[Open Sans] p-3"></div>
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
  font-family: 'Comic sans', sans-serif;
  @apply antialiased text-gray-800;
}
main{
  background-image: url("../grid-frontend/public/grid-bg.jpg");
  background-size: 50%;
}
</style>