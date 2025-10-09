<template>
  <div>
    <div
      v-if="isLoading"
      class="spinner-container"
    >
      <h1>Carregando...</h1>
    </div>
    <MdProductDetails
      v-else-if="product"
      :product="product"
    />
    <VAlert
      v-else-if="!isLoading"
      type="error"
    >
      Produto não encontrado
    </VAlert>
  </div>
</template>

<script setup lang="ts">
import type { IProduct } from '~/types/product'

const route = useRoute()
const id = route.params.id

const product = ref<IProduct | null>(null)
const isLoading = ref<boolean>(true)

const { getProductById } = useProduct({})

onMounted(async () => {
  if (!id) {
    throw new Error('Product ID is required')
  }
  // Use cache on initial load for better performance
  product.value = await getProductById(id as string)
  isLoading.value = false
})
</script>

<style lang="scss">
.spinner-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
}
</style>
