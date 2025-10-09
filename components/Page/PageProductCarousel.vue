<template>
  <div class="page-product-carousel">
    <h3
      v-if="section.title"
      class="carousel-title"
    >
      {{ section.title }}
    </h3>
    <div class="products-container">
      <MdProductCard
        v-for="product in products"
        :key="product.id"
        :product="product"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IProductCarouselSection } from '~/types/page'
import type { IProduct } from '~/types/product'

const props = defineProps<{
  section: IProductCarouselSection
}>()

const products = ref<IProduct[]>([])

// Fetch products based on productIds
onMounted(async () => {
  const { getProductById } = useProduct({})
  const productPromises = props.section.productIds.map(id => getProductById(id))
  const results = await Promise.all(productPromises)
  products.value = results.filter((p): p is IProduct => p !== null)
})
</script>

<style scoped lang="scss">
.page-product-carousel {
  padding: 32px 0;

  .carousel-title {
    font-size: 2rem;
    font-weight: 600;
    text-align: center;
    margin-bottom: 32px;
    color: #1d1d1f;
  }

  .products-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 24px;
  }
}
</style>
