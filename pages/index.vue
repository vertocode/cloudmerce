<template>
  <MdBanner />
  <MdSearchBar style="margin-top: -24px" />
  <MdProductList :products :loading :updateProductList />
</template>

<script setup lang="ts">
const { products, loading, update: updateProductList } = useProductList()
</script>
