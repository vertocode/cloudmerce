<template>
  <div
    v-if="loading"
    class="spinner"
  >
    <VProgressCircular
      indeterminate
      color="var(--primary-color-500)"
      size="50"
    />
  </div>
  <VRow v-else-if="products.length">
    <VCol
      v-for="product in products"
      :key="product.id"
      cols="12"
      xl="3"
      lg="3"
      md="4"
      sm="6"
    >
      <MdProductCard
        :product
        :update-product-list
      />
    </VCol>
  </VRow>
  <MdNoProducts
    v-else
    @retry="retryFetch"
    @go-home="goToHomePage"
  />
</template>

<script setup lang="ts">
import type { IProduct } from '~/types/product'

const router = useRouter()

const props = defineProps<{
  products: IProduct[]
  updateProductList: (param: { cache: 'no-cache' | 'force-cache' }) => Promise<void>
  loading?: boolean
}>()

const retryFetch = async () => {
  await props.updateProductList({ cache: 'no-cache' })
}

const goToHomePage = () => {
  router.push('/')
}
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
