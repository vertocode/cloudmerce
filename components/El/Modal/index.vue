<template>
  <VDialog
      :model-value="isOpened"
      :max-width="maxWidth || '400'"
      persistent
  >
    <template v-slot:activator="{ props: activatorProps }">
      <slot name="trigger" v-bind="activatorProps" />
    </template>

    <VCard v-bind="cardProps">
      <VContainer>
        <slot></slot>
      </VContainer>
    </VCard>
  </VDialog>
</template>

<script setup lang="ts">

defineProps<{
  maxWidth?: string
  isOpened: boolean
  cardProps: object
}>()

</script>
