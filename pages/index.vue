<template>
  <MdBanner />
  <MdSearchBar style="margin-top: -24px" />
  <MdContainer class="main_container">
    <MdProductList
      :products
      :loading
      :current-page="currentPage"
      :total-pages="totalPages"
      :update-product-list="updateProductList"
      @page-change="onChangePage"
    />
  </MdContainer>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'no-container',
})
const { products, loading, update: updateProductList, totalPages, onChangePage, currentPage } = useProductList()
</script>
