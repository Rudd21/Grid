<script setup lang="ts">
import ModalProvider from './provider/ModalProvider.vue';

const auth = useAuthStore();

onMounted(()=>{
  auth.fetchUser();
})
</script>

<template>
  <ModalProvider>
    <div class="project flex flex-col min-h-screen bg-[#E9DFC3]">
      <ClientOnly>
        <AppNavigation />
        <template #fallback>
          <div class="group shadow-regular font-saira bg-[#FFF8F8] mt-3 border-2 border-[black] h-[75px] w-[95%] m-auto p-3"></div>
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
</style>