<script setup lang="ts">

const props = defineProps<{taskId: string}>();

</script>

<template>
    Модалка по налаштуванні задач {{ props.taskId }}
</template>