<template>
  <VMenu v-if="isLogged">
    <template v-slot:activator="{ props }">
      <VBtn
          class="user-button"
          :class="{ 'admin-btn': isAdmin }"
          v-bind="props"
      >
        <VIcon>{{ isAdmin ? 'mdi-account-check' : 'mdi-account' }}</VIcon>
        {{ userData?.name?.split(' ')?.at(0) }}
      </VBtn>
    </template>

    <VList>
<!--      <VListItem @click="$router.push('/profile')">-->
<!--        <VListItemTitle>-->
<!--          <VIcon>mdi-account</VIcon> Profile-->
<!--        </VListItemTitle>-->
<!--      </VListItem>-->
      <VListItem @click="logout">
        <VListItemTitle>
          <VIcon>mdi-logout</VIcon> Logout
        </VListItemTitle>
      </VListItem>
    </VList>
  </VMenu>

  <div v-else class="unlogged_actions">
    <div class="desktop">
      <template v-if="isLoading">
        <VBtn :loading="true" disabled>
          <VProgressCircular indeterminate size="24" />
        </VBtn>
      </template>
      <template v-else>
        <MdLoginModal>
          <VBtn prepend-icon="mdi-account">Login</VBtn>
        </MdLoginModal>

        <MdRegisterModal>
          <VBtn prepend-icon="mdi-account-plus">Cadastro</VBtn>
        </MdRegisterModal>
      </template>
    </div>
    <div class="mobile">
      <template v-if="isLoading">
        <VBtn :loading="true" disabled>
          <VProgressCircular indeterminate size="24" />
        </VBtn>
      </template>
      <template v-else>
        <MdLoginModal>
          <VBtn icon="mdi-account-arrow-right" />
        </MdLoginModal>

        <MdRegisterModal>
          <VBtn icon="mdi-account-plus" />
        </MdRegisterModal>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
const { logout, userData, isAdmin } = useUser()

const isLogged = computed(() => !!userData.value)
const isLoading = ref(true)

onMounted(() => {
  isLoading.value = false;
})
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

@media screen and (max-width: $mobile-breakpoint) {
  .user-button {
    max-width: 100px;
    font-size: .8rem;
  }
}

.admin-btn {
  color: #fff;
  background-color: var(--secondary-color-500);
  border-radius: 8px;
  transition: background-color 0.3s ease;

  .v-icon {
    color: white;
  }
}
</style>
