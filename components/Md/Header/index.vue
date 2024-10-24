<template>
  <header>
    <MdContainer class="header_container">
      <VRow>
        <VCol cols="6" class="logo_container">
          <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHl61Sy02jzSLGguydQ4lNQvMlYGJn1tOSRQ&s"
              alt="My App"
              @click="$router.push('/')"
          />
        </VCol>

        <VCol cols="6" class="action_container">
          <UserButton />
          <CartButton />
        </VCol>
      </VRow>
    </MdContainer>
  </header>
</template>

<script setup lang="ts">
import UserButton from '~/components/Md/Header/UserButton.vue'
import CartButton from "~/components/Md/Header/CartButton.vue";

const links = [
  { name: 'Home', to: '/' },
  { name: 'About', to: '/about' },
]

</script>

<style scoped lang="scss">
header {
  padding: 4px 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  .header_container {
    display: flex;
    justify-content: space-between;

    .logo_container {
      img {
        cursor: pointer;
        max-width: 52px;
        max-height: 52px;
      }
    }
  }

  .action_container {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 8px;
  }
}
</style>
