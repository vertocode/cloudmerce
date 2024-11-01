<template>
  <MdBanner />
  <MdSearchBar style="margin-top: -24px" />
  <MdProductList :products />
</template>

<script setup lang="ts">
const { products } = useProductList()
</script>
