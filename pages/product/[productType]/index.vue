<template>
  <div>
    <h2 class="product-type-title">{{ productTypeData?.name }}</h2>
    <MdSearchBar class="mt-3" />

    <MdProductList :products :loading :updateProductList />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'container'
})

import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { useProductList } from "~/composables/useProductList";
import { useStoreData } from "~/composables/useStoreData";

const route = useRoute()
const productType = computed(() => route.params.productType as string)
const { getProductTypeById } = useStoreData()
const { products, loading, update: updateProductList } = useProductList({
  productType: productType.value
})

const productTypeData = computed(() => getProductTypeById(productType.value))
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
