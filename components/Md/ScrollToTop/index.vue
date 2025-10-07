<template>
  <v-btn
    v-if="isVisible"
    class="scroll-to-top"
    icon
    elevation="4"
    @click="scrollToTop"
  >
    <v-icon>mdi-arrow-up</v-icon>
  </v-btn>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const isVisible = ref(false)
const scrollThreshold = 0.1

const handleScroll = () => {
  const scrollTop = window.scrollY
  const documentHeight = document.documentElement.scrollHeight
  const windowHeight = window.innerHeight
  const scrollableHeight = documentHeight - windowHeight
  const scrollPercent = scrollTop / scrollableHeight

  isVisible.value = scrollPercent > scrollThreshold
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  handleScroll()
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.scroll-to-top {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 1000;
  border-radius: 50%;
  width: 56px;
  height: 56px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  transition: background-color 0.3s ease;
}
</style>
