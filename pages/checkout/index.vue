<template>
  <div v-if="loading" class="spinner-container">
    <h1>Carregando...</h1>
  </div>
  <div class="checkout" v-else-if="cartProducts.length">
    <MdCheckoutSteps />

    <MdCheckoutDetails />
  </div>
  <MdCheckoutEmpty v-else/>
</template>

<script setup lang="ts">
const { cartProducts, loading } = useCart()
</script>

<style lang="scss">
.spinner-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 24px;
  height: 50vh;
}

.checkout {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 16px;

  @media screen and (max-width: $mobile-breakpoint) {
    display: flex;
    flex-direction: column-reverse;
  }
}
</style>
