<template>
  <VRow>
    <VCol
        cols="12"
        xl="3"
        lg="3"
        md="4"
        sm="6"
        v-for="product in products"
        :key="product.id"
    >
      <MdProductCard :product="product" />
    </VCol>
  </VRow>
</template>

<script setup lang="ts">
import type { IProduct } from "~/types/product"

defineProps<{
  products: IProduct[]
}>()
</script>
