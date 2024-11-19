<template>
  <div class="empty-cart-container">
    <v-icon class="empty-cart-icon" size="96">mdi-cart-outline</v-icon>
    <h2 class="empty-cart-title">Carrinho Vazio</h2>
    <v-btn
        color="primary"
        class="home-button"
        @click="redirectToHome"
    >
      Adicionar Produtos
    </v-btn>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const redirectToHome = () => {
  router.push('/')
}
</script>

<style scoped lang="scss">
.empty-cart-container {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  text-align: center;
}

.empty-cart-icon {
  color: #9e9e9e;
  margin-bottom: 20px;
}

.empty-cart-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #616161;
}

.home-button {
  font-size: 16px;
  padding: 10px 20px;
  text-transform: none;
}
</style>
