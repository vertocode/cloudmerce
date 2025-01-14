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
@import url('https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap');

.subheader {
  display: flex;
  background-color: var(--primary-color-700);
  align-items: center;
  padding: 4px 24px;

  @media screen and (max-width: $mobile-breakpoint) {
    padding: 4px 16px;
  }

  .scroll-btn {
    color: #3498db;
  }

  .scroll-container {
    margin: auto;
    display: flex;
    gap: 8px;
    overflow-x: auto;
    scroll-behavior: smooth;
    white-space: nowrap;
    padding: 4px;

    &::-webkit-scrollbar {
      display: none;
    }

    .product-type {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 0.5rem 1rem;
      color: #fff;
      font-size: 1rem;
      font-family: "Nunito", serif;
      font-weight: 300;
      border-radius: 12px;
      cursor: pointer;
      white-space: nowrap;
      transition: background-color 0.3s, color 0.3s;
      position: relative;

      .v-icon {
        color: var(--primary-color-100);
      }

      @media screen and (max-width: $mobile-breakpoint) {
        padding: 0.5rem 0.75rem;
        font-size: .9rem;
      }

      &.active {
        background-color: var(--secondary-color-700);
        color: var(--secondary-color-100);

        .v-icon {
          color: var(--secondary-color-100);
        }
      }

      &:not(.active):hover::after {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        bottom: -2px;
        height: 2px;
        background-color: var(--primary-color-200);
        transition: width 0.3s ease, background-color 0.3s ease;
        width: 100%;
      }
    }
  }
}
</style>
