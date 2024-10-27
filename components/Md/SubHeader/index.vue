<template>
  <div class="subheader">
    <VBtn
        icon
        v-if="canScrollLeft"
        @click="scrollLeft"
        class="scroll-btn scroll-left"
    >
      <v-icon>mdi-chevron-left</v-icon>
    </VBtn>

    <div ref="scrollContainer" class="scroll-container">
      <div
          v-for="type in productTypes"
          :key="type"
          class="product-type"
          @click="redirectTo(type)"
      >
        {{ type }}
      </div>
    </div>

    <VBtn
        icon
        v-if="canScrollRight"
        @click="scrollRight"
        class="scroll-btn scroll-right"
    >
      <v-icon>mdi-chevron-right</v-icon>
    </VBtn>
  </div>
</template>

<script setup lang="ts">
import { useStoreData } from "@/composables/useStoreData"
import { useRouter } from "vue-router"

const { productTypes } = useStoreData()
const router = useRouter()

const scrollContainer = ref<null | HTMLDivElement>(null)

const canScrollLeft = ref(false)
const canScrollRight = ref(true)

const checkScrollButtons = () => {
  const container = scrollContainer.value
  if (container) {
    canScrollLeft.value = container.scrollLeft > 0
    canScrollRight.value =
        container.scrollLeft < container.scrollWidth - container.clientWidth
  }
};

const scrollLeft = () => {
  const container = scrollContainer.value;
  if (container) {
    container.scrollBy({ left: -200, behavior: "smooth" })
  }
};

const scrollRight = () => {
  const container = scrollContainer.value
  if (container) {
    container.scrollBy({ left: 200, behavior: "smooth" })
  }
}

const redirectTo = (type: string) => {
  router.push(`/product/${type}`)
}

onMounted(() => {
  checkScrollButtons()

  if (scrollContainer.value) scrollContainer.value.addEventListener("scroll", checkScrollButtons)
})
</script>

<style scoped lang="scss">
.subheader {
  display: flex;
  align-items: center;
  padding: 1rem;
  background-color: #f4f4f6;

  .scroll-btn {
    color: #3498db;
  }

  .scroll-container {
    display: flex;
    gap: 1rem;
    overflow-x: auto;
    scroll-behavior: smooth;
    white-space: nowrap;
    padding: 0.5rem;

    &::-webkit-scrollbar {
      display: none;
    }

    .product-type {
      padding: 0.5rem 1rem;
      background-color: var(--primary-color-500);
      color: var(--secondary-color-100);
      border-radius: 25px;
      cursor: pointer;
      white-space: nowrap;
      transition: background-color 0.3s;
    }
  }
}
</style>
