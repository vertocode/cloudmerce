<template>
  <MdSearchBar />
  <h1>{{ productType }}:</h1>
  <MdProductList />
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
const productType = computed(() => route.params.productType)
</script>
