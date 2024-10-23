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

  <MdLoginModal v-else>
    <VBtn prepend-icon="mdi-account">
      Login
    </VBtn>
  </MdLoginModal>
</template>

<script setup lang="ts">
const user = useState('user')

const showLoginModal = ref(false)
const isLogged = computed(() => !!user.value)

const logout = () => {
  // logout
}
</script>
