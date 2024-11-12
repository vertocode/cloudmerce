<template>
  <MdBanner />
  <MdSearchBar style="margin-top: -24px" />
  <MdContainer class="main_container">
     <MdProductList :products :loading :updateProductList />
  </MdContainer>
</template>

<script setup lang="ts">
const { products, loading, update: updateProductList } = useProductList()
</script>
