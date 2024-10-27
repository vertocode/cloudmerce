<template>
  <div class="subheader">
    <VBtn icon v-if="canScrollLeft" @click="scrollLeft" class="scroll-btn scroll-left">
      <v-icon>mdi-chevron-left</v-icon>
    </VBtn>

    <div ref="scrollContainer" class="scroll-container">
      <div
          v-for="type in productTypes"
          :key="type"
          :class="['product-type', { active: isActiveType(type) }]"
          @click="redirectTo(type)"
      >
        {{ type }}
      </div>
    </div>

    <VBtn icon v-if="canScrollRight" @click="scrollRight" class="scroll-btn scroll-right">
      <v-icon>mdi-chevron-right</v-icon>
    </VBtn>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useStoreData } from "@/composables/useStoreData"
import { useRouter, useRoute } from "vue-router"

const { productTypes } = useStoreData()
const router = useRouter()
const route = useRoute()

const scrollContainer = ref<null | HTMLDivElement>(null)
const canScrollLeft = ref(false)
const canScrollRight = ref(true)

const checkScrollButtons = () => {
  const container = scrollContainer.value
  if (container) {
    canScrollLeft.value = container.scrollLeft > 0
    canScrollRight.value = container.scrollLeft < container.scrollWidth - container.clientWidth
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

// Determine if a type is active based on the URL
const isActiveType = (type: string) => route.params.productType === type

onMounted(() => {
  checkScrollButtons()
  if (scrollContainer.value) scrollContainer.value.addEventListener("scroll", checkScrollButtons)
})
</script>

<style scoped lang="scss">
.subheader {
  display: flex;
  align-items: center;
  padding: 4px 24px;
  background-color: #f4f4f6;

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
      padding: 0.5rem 1rem;
      background-color: var(--primary-color-500);
      color: #fff;
      border-radius: 25px;
      cursor: pointer;
      white-space: nowrap;
      transition: background-color 0.3s, color 0.3s;

      &.active {
        background-color: var(--secondary-color-500);
        color: var(--primary-color-500);
        font-weight: bold;
      }

      &:hover {
        background-color: #d1d1d1;
      }
    }
  }
}
</style>
