<template>
  <MdBanner />
  <MdSearchBar style="margin-top: -24px" />
  <MdProductList :products :loading />
</template>

<script setup lang="ts">
const { products, loading } = useProductList()
</script>
