<template>
  <!-- Check if product image is a string (single image) -->
  <VImg
    v-if="isStringImage || (images?.length && asImage)"
    :src="images?.length ? images[0] : images as string"
    color="#E6E8EF"
    class="product-image"
  />

  <!-- Check if product image is an array with one image -->
  <VImg
    v-else-if="images?.length === 1"
    :src="images[0]"
    alt=""
    color="#E6E8EF"
    class="product-image"
  />

  <!-- Carousel for multiple images -->
  <VCarousel
    v-else-if="images?.length > 1"
    hide-delimiter-background
    show-arrows="hover"
    :cycle
    class="product-image-carousel"
  >
    <VCarouselItem
      v-for="(img, index) in images"
      :key="index"
    >
      <VImg
        :src="img"
        alt=""
        aspect-ratio="1"
        class="product-image"
      />
    </VCarouselItem>
  </VCarousel>

  <!-- Default image if no product image is available -->
  <VImg
    v-else
    src="~/assets/productWithoutImage.webp"
    alt=""
    aspect-ratio="1"
    class="product-image"
  />
</template>

<script setup lang="ts">
const props = defineProps<{
  image: string | string[]
  asImage?: boolean
  cycle?: boolean
}>()

const images = computed(() => {
  if (Array.isArray(props.image)) {
    return props.image.filter(img => img?.includes('https')) as string[]
  }

  return props.image as string
})

const isStringImage = computed(() => {
  return typeof images.value === 'string'
})
</script>

<style lang="scss" scoped>
.product-image-carousel {
  height: max-content !important;
}

.product-image {
  mix-blend-mode: darken;
}
</style>
