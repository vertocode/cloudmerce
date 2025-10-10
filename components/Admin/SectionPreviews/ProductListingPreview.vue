<template>
  <div class="product-listing-preview">
    <div class="preview-header">
      <VIcon color="primary">mdi-view-grid</VIcon>
      <div class="preview-info">
        <p v-if="section.title" class="preview-title">
          <strong>Título:</strong> {{ section.title }}
        </p>
        <p v-if="section.productTypeFilter" class="preview-filter">
          <strong>Filtro de Tipo:</strong> {{ section.productTypeFilter }}
        </p>
        <p v-if="section.searchFilter" class="preview-filter">
          <strong>Busca:</strong> {{ section.searchFilter }}
        </p>
        <p v-if="!section.title && !section.productTypeFilter && !section.searchFilter" class="preview-empty">
          Lista de produtos (todos os produtos)
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IProductListingSection } from '~/types/page'

defineProps<{
  section: IProductListingSection
}>()
</script>

<style scoped lang="scss">
.product-listing-preview {
  .preview-header {
    display: flex;
    gap: 12px;
    align-items: flex-start;

    .preview-info {
      flex: 1;

      p {
        margin: 4px 0;
        font-size: 0.875rem;
        color: #1d1d1f;

        &.preview-empty {
          color: #86868b;
          font-style: italic;
        }

        strong {
          font-weight: 600;
        }
      }
    }
  }
}
</style>
