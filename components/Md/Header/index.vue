<template>
  <header>
    <MdContainer class="header_container">
      <VRow>
        <VCol cols="6" class="logo_container">
          <img
              :src="storeLogo"
              alt="Logo"
              @click="$router.push('/')"
          />
        </VCol>

        <VCol cols="6" class="action_container">
          <UserButton />
          <CartButton />
          <MenuButton />
        </VCol>
      </VRow>
    </MdContainer>
  </header>
</template>

<script setup lang="ts">
import UserButton from '~/components/Md/Header/UserButton.vue'
import CartButton from "~/components/Md/Header/CartButton.vue"
import MenuButton from "~/components/Md/Header/MenuButton.vue"

const { storeLogo } = useStoreData()

</script>

<style scoped lang="scss">
header {
  padding: 4px 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  .header_container {
    display: flex;
    justify-content: space-between;

    .logo_container {
      display: flex;
      align-items: center;
      img {
        cursor: pointer;
        height: 59px;

        @media screen and (max-width: $mobile-breakpoint) {
          height: 40px;
        }
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
