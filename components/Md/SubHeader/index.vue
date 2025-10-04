<template>
  <div
    v-if="productTypes.length"
    class="subheader"
  >
    <VBtn
      v-if="canScrollLeft"
      icon
      class="scroll-btn scroll-left"
      @click="scrollLeft"
    >
      <v-icon>mdi-chevron-left</v-icon>
    </VBtn>

    <div
      ref="scrollContainer"
      class="scroll-container"
    >
      <div
        v-for="type in productTypes"
        :key="type.id"
        :class="['product-type', { active: isActiveType(type.id) }]"
        @click="redirectTo(type.id)"
      >
        <VIcon v-if="type.icon">
          {{ type.icon.includes('mdi') ? type.icon : `mdi-${type.icon}` }}
        </VIcon>
        {{ type.name }}
      </div>
    </div>

    <VBtn
      v-if="canScrollRight"
      icon
      class="scroll-btn scroll-right"
      @click="scrollRight"
    >
      <v-icon>mdi-chevron-right</v-icon>
    </VBtn>
  </div>
</template>

<script setup lang="ts">
const { productTypes } = useProductTypes()
const router = useRouter()
const route = useRoute()

const scrollContainer = ref<null | HTMLDivElement>(null)
const canScrollLeft = ref(false)
const canScrollRight = ref(false)

const checkScrollButtons = () => {
  const container = scrollContainer.value
  if (container) {
    canScrollLeft.value = container.scrollLeft > 0
    canScrollRight.value = container.scrollLeft < container.scrollWidth - container.clientWidth
  }
}

const scrollLeft = () => {
  const container = scrollContainer.value
  if (container) {
    container.scrollBy({ left: -200, behavior: 'smooth' })
  }
}

const scrollRight = () => {
  const container = scrollContainer.value
  if (container) {
    container.scrollBy({ left: 200, behavior: 'smooth' })
  }
}

const redirectTo = (type: string) => {
  router.push(`/product/type/${type}`)
}

// Determine if a type is active based on the URL
const isActiveType = (type: string) => route.params.type === type

onMounted(() => {
  checkScrollButtons()
  if (scrollContainer.value) scrollContainer.value.addEventListener('scroll', checkScrollButtons)
})
</script>

<style scoped lang="scss">
.subheader {
  display: flex;
  background-color: #f5f5f7;
  align-items: center;
  padding: 8px 24px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);

  @media screen and (max-width: $mobile-breakpoint) {
    padding: 8px 16px;
  }

  .scroll-btn {
    color: var(--primary-color);
    flex-shrink: 0;
  }

  .scroll-container {
    margin: 0 auto;
    display: flex;
    gap: 8px;
    overflow-x: auto;
    scroll-behavior: smooth;
    white-space: nowrap;
    padding: 4px 0;
    max-width: 1440px;

    &::-webkit-scrollbar {
      display: none;
    }

    .product-type {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      color: #1d1d1f;
      font-size: 14px;
      font-weight: 400;
      border-radius: 20px;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.2s ease;
      background-color: transparent;

      .v-icon {
        font-size: 18px;
        color: var(--primary-color);
      }

      @media screen and (max-width: $mobile-breakpoint) {
        padding: 6px 14px;
        font-size: 13px;
      }

      &:hover {
        background-color: rgba(0, 0, 0, 0.04);
      }

      &.active {
        background-color: var(--primary-color);
        color: #fff;
        font-weight: 500;

        .v-icon {
          color: #fff;
        }
      }
    }
  }
}
</style>
