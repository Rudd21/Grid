<script setup lang="ts">
import type { Component } from 'vue';


interface ModalOptions {
    component?: Component;
    props?: Record<string, any>;
}

export interface ModalContext {
    open: (options: ModalOptions) => void
    close: () => void
}

const isOpen = ref(false);
const options = ref<ModalOptions | null>(null);

const open = (opts: ModalOptions) => {
    options.value = opts;
    isOpen.value = true;
}

const close = () =>{
    isOpen.value = false;
}

const modalContext: ModalContext = {
    open,
    close
}

provide('modal', modalContext)
</script>

<template>
    <teleport to="body">
        <div v-if="isOpen" class="fixed inset-0 bg-black/50 flex items-center justify-center" @click="close">
            <div class="bg-white p-2" @click.stop>
                <component :is="options?.component" v-bind="options?.props" />
                <button class="bg-red-500 text-white p-1" @click="close">Закрити</button>
            </div>
        </div>
    </teleport>

    <slot />
</template>