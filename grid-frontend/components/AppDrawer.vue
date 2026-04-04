<script setup lang="ts">

defineProps<{isOpen: boolean}>()
defineEmits(['close'])

</script>

<template>
    <Transition name="drawer">
        <div v-if="isOpen" class="fixed top-0 right-0 h-full w-[450px] bg-white shadow-x1 z-50 p-4">
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