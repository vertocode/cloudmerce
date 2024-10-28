<template>
  <v-btn
      v-if="isVisible"
      class="scroll-to-top"
      icon
      @click="scrollToTop"
      color="primary"
      elevation="4"
  >
    <v-icon>mdi-arrow-up</v-icon>
  </v-btn>
</template>

<style scoped>
.scroll-to-top {
  position: fixed;
  top: 30px;
  right: 30px;
  z-index: 1000;
  border-radius: 50%; /* Botão circular */
  width: 56px; /* Largura do botão */
  height: 56px; /* Altura do botão */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3); /* Sombra do botão */
  transition: background-color 0.3s ease; /* Transição suave para hover */
}

.scroll-to-top:hover {
  background-color: rgba(0, 123, 255, 0.8); /* Efeito de hover */
}
</style>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';

const isVisible = ref(false);
const scrollThreshold = 0.1;

const handleScroll = () => {
  const scrollTop = window.scrollY;
  const documentHeight = document.documentElement.scrollHeight;
  const windowHeight = window.innerHeight;
  const scrollableHeight = documentHeight - windowHeight;
  const scrollPercent = scrollTop / scrollableHeight;

  isVisible.value = scrollPercent > scrollThreshold;
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  handleScroll();
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>
