<template>
  <MdBanner />
  <MdSearchBar style="margin-top: -24px" />
  <MdContainer class="main_container">
    <MdProductList
      :products
      :loading
      :update-product-list
    />
  </MdContainer>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'no-container',
})
const { products, loading, update: updateProductList } = useProductList()
</script>
