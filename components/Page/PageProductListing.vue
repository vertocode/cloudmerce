<template>
  <div
    class="product-listing-section"
    :style="{
      marginTop: `${section.marginTop || 0}px`,
      marginBottom: `${section.marginBottom || 0}px`
    }"
  >
    <MdContainer v-if="section.title" class="section-header">
      <h2>{{ section.title }}</h2>
    </MdContainer>

    <MdContainer class="main_container">
      <MdProductList
        :products
        :loading
        :current-page="currentPage"
        :total-pages="totalPages"
        :total-items="totalItems"
        :update-product-list="updateProductList"
        @page-change="onChangePage"
      />
    </MdContainer>
  </div>
</template>

<script setup lang="ts">
import type { IProductListingSection } from '~/types/page'

const props = defineProps<{
  section: IProductListingSection
}>()

const { products, loading, update: updateProductList, totalPages, totalItems, onChangePage, currentPage } = useProductList({
  productType: props.section.productTypeFilter || undefined,
  search: props.section.searchFilter || undefined,
})
</script>

<style scoped lang="scss">
.product-listing-section {
  .section-header {
    padding: 32px 0 16px;

    h2 {
      font-size: 2rem;
      font-weight: 700;
      color: #1d1d1f;
      text-align: center;

      @media (max-width: 768px) {
        font-size: 1.5rem;
      }
    }
  }
}
</style>
