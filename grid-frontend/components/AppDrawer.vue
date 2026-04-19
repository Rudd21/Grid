<script setup lang="ts">

defineProps<{isOpen: boolean}>()
defineEmits(['close'])

</script>

<template>
    <Transition name="drawer">
        <div v-if="isOpen" class="fixed top-0 right-0 h-full w-[450px] bg-white shadow-xl z-50 p-4">
            <button @click="$emit('close')">✕</button>
            <slot />
        </div>
    </Transition>

    <Transition name="fade">
        <div 
            v-if="isOpen"
            class="fixed inset-0 bg-black/50 z-40"    
            @click="$emit('close')"    
        />
    </Transition>
</template>

<style>
.drawer-enter-active, .drawer-leave-active {
  transition: transform 0.3s ease;
}
.drawer-enter-from, .drawer-leave-to {
  transform: translateX(100%);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>