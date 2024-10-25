<template>
  <VMenu v-if="isLogged">
    <template v-slot:activator="{ props }">
      <VBtn icon="mdi-account" v-bind="props" />
    </template>

    <VList>
      <VListItem @click="$router.push('/profile')">
        <VListItemTitle>
          <VIcon>mdi-account</VIcon> Profile
        </VListItemTitle>
      </VListItem>
      <VListItem @click="showLoginModal = true">
        <VListItemTitle>
          <VIcon>mdi-logout</VIcon> Logout
        </VListItemTitle>
      </VListItem>
    </VList>
  </VMenu>

  <div v-else class="unlogged_actions">
    <div class="desktop">
      <MdLoginModal>
        <VBtn prepend-icon="mdi-account">
          Login
        </VBtn>
      </MdLoginModal>

      <MdRegisterModal>
        <VBtn prepend-icon="mdi-account-plus">
          Cadastro
        </VBtn>
      </MdRegisterModal>
    </div>
    <div class="mobile">
      <MdLoginModal>
        <VBtn icon="mdi-account-arrow-right" />
      </MdLoginModal>

      <MdRegisterModal>
        <VBtn icon="mdi-account-plus" />
      </MdRegisterModal>
    </div>
  </div>
</template>

<script setup lang="ts">
const user = useState('user')

const showLoginModal = ref(false)
const isLogged = computed(() => !!user.value)

const logout = () => {
  // logout
}
</script>

<style lang="scss">
.unlogged_actions {
  display: flex;
  gap: 8px;

  .desktop {
    display: none;
  }

  .mobile {
    display: flex;
    gap: 8px;
  }

  @media (min-width: 600px) {
    .desktop {
      display: flex;
      gap: 8px;
    }

    .mobile {
      display: none;
    }
  }
}
</style>
