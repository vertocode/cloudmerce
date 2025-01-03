<template>
  <VDialog
    :model-value="isOpened"
    width="auto"
    :min-width="minWidth || '380'"
    :max-width="maxWidth || '1200'"
    :persistent
  >
    <template #activator="{ props: activatorProps }">
      <slot
        name="trigger"
        v-bind="activatorProps"
      />
    </template>

    <VCard
      v-bind="cardProps"
      class="modal-card"
    >
      <VBtn
        v-if="!hideClose"
        variant="text"
        icon
        class="close-btn"
        @click="$emit('close')"
      >
        <VIcon>mdi-close</VIcon>
      </VBtn>

      <VContainer>
        <slot />
      </VContainer>
    </VCard>
  </VDialog>
</template>

<script setup lang="ts">
defineProps<{
  isOpened: boolean
  cardProps: object
  minWidth?: string
  maxWidth?: string
  hideClose?: boolean
  persistent?: boolean
}>()
</script>

<style scoped>
.modal-card {
  position: relative;
}

.close-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  color: var(--primary-color-500);
  z-index: 1;
}
</style>
