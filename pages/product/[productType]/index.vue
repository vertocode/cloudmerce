<template>
  <MdSearchBar />
  <div>
    <h1>{{ productType }} <<</h1>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
const productType = computed(() => route.params.productType)
</script>
