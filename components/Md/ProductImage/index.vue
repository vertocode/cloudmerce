<template>
  <!-- Check if product image is a string (single image) -->
  <VImg
      v-if="isStringImage || (images?.length && asImage)"
      :src="images?.length ? images[0] : images as string"
      :alt="product.name"
      aspect-ratio="1"
      class="product-image"
  />

  <!-- Check if product image is an array with one image -->
  <VImg
      v-else-if="images?.length === 1"
      :src="images[0]"
      :alt="product.name"
      aspect-ratio="1"
      class="product-image"
  />

  <!-- Carousel for multiple images -->
  <VCarousel v-else-if="images?.length > 1" class="product-image-carousel">
    <VCarouselItem v-for="(img, index) in images" :key="index">
      <VImg :src="img" :alt="product.name" aspect-ratio="1" class="product-image" />
    </VCarouselItem>
  </VCarousel>

  <!-- Default image if no product image is available -->
  <VImg
      v-else
      src="~/assets/productWithoutImage.webp"
      :alt="product.name"
      aspect-ratio="1"
      class="product-image"
  />
</template>


<script setup lang="ts">
import type {IProduct} from "~/types/product";

const props = defineProps<{
  product: IProduct
  asImage: boolean
}>()

const images = computed(() => {
  if (Array.isArray(props.product.image)) {
    return props.product.image.filter(img => img?.includes('https')) as string[]
  }

  return props.product.image as string
})

const isStringImage = computed(() => {
  return typeof images.value === 'string'
})
</script>

<style lang="scss" scoped>
.product-image-carousel {
  height: max-content !important;
}
</style>
