<template>
    <VeeMaskedField
        :name
        mask="##/##/####"
        v-bind="{...$attrs}"
    />
</template>

<script setup lang="ts">
defineProps<{
  name: string
}>()
</script>
