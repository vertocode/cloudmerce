<template>
  <div
    class="page-product-carousel"
    :style="{
      marginTop: `${section.marginTop || 0}px`,
      marginBottom: `${section.marginBottom || 0}px`
    }"
  >
    <h3
      v-if="section.title"
      class="carousel-title"
    >
      {{ section.title }}
    </h3>
    <div
      ref="carouselContainer"
      class="products-container"
      :class="{ 'has-overflow': hasOverflow }"
    >
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
const carouselContainer = ref<HTMLElement | null>(null)
const hasOverflow = ref(false)
const scrollInterval = ref<NodeJS.Timeout | null>(null)

// Check if container has overflow
const checkOverflow = () => {
  if (!carouselContainer.value) return

  const container = carouselContainer.value
  hasOverflow.value = container.scrollWidth > container.clientWidth
}

// Auto-scroll function
const startAutoScroll = () => {
  if (!hasOverflow.value || !carouselContainer.value) return

  scrollInterval.value = setInterval(() => {
    if (!carouselContainer.value) return

    const container = carouselContainer.value
    const maxScroll = container.scrollWidth - container.clientWidth

    // If reached the end, reset to beginning
    if (container.scrollLeft >= maxScroll - 1) {
      container.scrollTo({ left: 0, behavior: 'smooth' })
    } else {
      // Scroll by one card width (approximately 274px = 250px card + 24px gap)
      container.scrollBy({ left: 274, behavior: 'smooth' })
    }
  }, 3000) // Scroll every 3 seconds
}

// Stop auto-scroll
const stopAutoScroll = () => {
  if (scrollInterval.value) {
    clearInterval(scrollInterval.value)
    scrollInterval.value = null
  }
}

// Fetch products based on productIds
onMounted(async () => {
  const { getProductById } = useProduct({})
  const productPromises = props.section.productIds.map(id => getProductById(id))
  const results = await Promise.all(productPromises)
  products.value = results.filter((p): p is IProduct => p !== null)

  // Check for overflow and start auto-scroll after products are loaded
  await nextTick()
  checkOverflow()

  if (hasOverflow.value) {
    startAutoScroll()
  }

  // Re-check on window resize
  window.addEventListener('resize', () => {
    stopAutoScroll()
    checkOverflow()
    if (hasOverflow.value) {
      startAutoScroll()
    }
  })
})

// Pause auto-scroll when user hovers over carousel
const handleMouseEnter = () => {
  stopAutoScroll()
}

const handleMouseLeave = () => {
  if (hasOverflow.value) {
    startAutoScroll()
  }
}

onMounted(() => {
  if (carouselContainer.value) {
    carouselContainer.value.addEventListener('mouseenter', handleMouseEnter)
    carouselContainer.value.addEventListener('mouseleave', handleMouseLeave)
  }
})

onUnmounted(() => {
  stopAutoScroll()
  if (carouselContainer.value) {
    carouselContainer.value.removeEventListener('mouseenter', handleMouseEnter)
    carouselContainer.value.removeEventListener('mouseleave', handleMouseLeave)
  }
  window.removeEventListener('resize', checkOverflow)
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
    display: flex;
    gap: 24px;
    overflow-x: hidden;
    scroll-behavior: smooth;

    // Only show scrollbar when there's overflow
    &.has-overflow {
      overflow-x: auto;

      // Hide scrollbar for better UX
      scrollbar-width: none; /* Firefox */
      -ms-overflow-style: none; /* IE and Edge */

      &::-webkit-scrollbar {
        display: none; /* Chrome, Safari, Opera */
      }
    }

    // Each product card has a minimum width
    > * {
      flex: 0 0 250px;
      min-width: 250px;
    }
  }
}
</style>
