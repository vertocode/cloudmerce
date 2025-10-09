<template>
  <div class="product-carousel-preview">
    <div class="preview-label">
      <VIcon size="small">
        mdi-view-carousel
      </VIcon>
      <span>Carrossel de Produtos</span>
    </div>
    <div class="preview-content">
      <strong v-if="section.title">{{ section.title }}</strong>
      <p>
        {{ section.productIds?.length || 0 }} produto(s) selecionado(s)
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IProductCarouselSection } from '~/types/page'

defineProps<{
  section: IProductCarouselSection
}>()
</script>

<style scoped lang="scss">
.product-carousel-preview {
  .preview-label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.875rem;
    font-weight: 600;
    color: #1d1d1f;
    margin-bottom: 12px;
  }

  .preview-content {
    strong {
      display: block;
      font-size: 0.875rem;
      margin-bottom: 4px;
    }

    p {
      font-size: 0.75rem;
      color: #86868b;
      margin: 0;
    }
  }
}
</style>
