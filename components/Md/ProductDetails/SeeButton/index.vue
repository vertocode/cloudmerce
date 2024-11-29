<template>
  <VBtn
      class="view-details-btn small-btn"
      size="x-small"
      variant="outlined"
      @click="$router.push(`/product/${productId}`)"
  >
    Ver Detalhes
  </VBtn>
</template>

<script setup lang="ts">
defineProps<{
  productId: string
}>()
</script>

<style lang="scss" scoped>
.view-details-btn {
  margin-top: 8px;
  color: var(--primary-color-500);
  border-color: var(--primary-color-500);
  font-size: 0.75rem;
  padding: 2.5px 8px 4px 8px;
}

.small-btn {
  border-radius: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
}
</style>
