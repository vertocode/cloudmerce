<template>
  <div class="checkout" v-if="cartProducts.length">
    <MdCheckoutSteps />

    <MdCheckoutDetails />
  </div>
  <MdCheckoutEmpty v-else/>
</template>

<script setup lang="ts">
const cartProducts = useState('cartProducts', () => [])
</script>

<style lang="scss">
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
