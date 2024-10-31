<template>
  <MdBanner />
  <MdSearchBar />
  <MdProductList :products />
</template>

<script setup lang="ts">
const { products } = useProductList()
</script>
