<template>
  <div v-if="loading" class="spinner">
    <VProgressCircular indeterminate color="var(--primary-color-500)" size="50" />
  </div>
  <VRow v-else>
    <VCol
        cols="12"
        xl="3"
        lg="3"
        md="4"
        sm="6"
        v-for="product in products"
        :key="product.id"
    >
      <MdProductCard :product :updateProductList />
    </VCol>
  </VRow>
</template>

<script setup lang="ts">
import type { IProduct } from "~/types/product"

defineProps<{
  products: IProduct[]
  updateProductList: (param: { cache: 'no-cache' | 'force-cache' }) => Promise<void>
  loading?: boolean
}>()
</script>

<style lang="scss">
.spinner {
  margin: auto;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
}
</style>
