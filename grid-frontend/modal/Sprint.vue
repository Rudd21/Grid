<script setup lang="ts">

const props = defineProps<{sprintId: string}>();

</script>

<template>
    Модалка по налаштуванні спринта: {{ props.sprintId }}
</template>