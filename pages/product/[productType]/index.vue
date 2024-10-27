<template>
  <MdSearchBar />
  <h2 class="product-type-title">{{ productType }}</h2>
  <MdProductList />
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const productType = computed(() => route.params.productType)
</script>

<style scoped>
.product-type-title {
  font-size: 2rem;
  font-weight: 700;
  color: #333333;
  text-align: center;
  margin: 20px 0;
  position: relative;
}

.product-type-title::after {
  content: '';
  display: block;
  width: 60px;
  height: 4px;
  background-color: var(--secondary-color-500);
  margin: 8px auto 0;
  border-radius: 2px;
}
</style>
