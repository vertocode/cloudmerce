<template>
  <div class="checkout">
    <MdCheckoutSteps />

    <MdCheckoutDetails />
  </div>
</template>

<script setup lang="ts">

</script>

<style lang="scss">
.checkout {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 16px;
}
</style>
