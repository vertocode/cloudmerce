<template>
  <VMenu v-if="isLogged">
    <template #activator="{ props }">
      <VBtn
        icon
        class="header-icon-btn"
        :class="{ 'admin-btn': isAdmin }"
        v-bind="props"
      >
        <VIcon size="20">
          {{ isAdmin ? 'mdi-account-check' : 'mdi-account-circle' }}
        </VIcon>
      </VBtn>
    </template>

    <VList>
      <VListItem @click="logout">
        <VListItemTitle>
          <VIcon>mdi-logout</VIcon> Logout
        </VListItemTitle>
      </VListItem>
    </VList>
  </VMenu>

  <div
    v-else
    class="unlogged_actions"
  >
    <template v-if="isLoading">
      <VBtn
        icon
        class="header-icon-btn"
        :loading="true"
        disabled
      >
        <VProgressCircular
          indeterminate
          size="20"
        />
      </VBtn>
    </template>
    <template v-else>
      <MdLoginModal>
        <VBtn
          icon
          class="header-icon-btn"
        >
          <VIcon size="20">mdi-account-circle</VIcon>
        </VBtn>
      </MdLoginModal>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const { logout, userData, isAdmin } = useUser()

const isLogged = computed(() => !!userData.value)
const isLoading = ref(true)

onMounted(() => {
  isLoading.value = false
})
</script>

<style lang="scss" scoped>
.header-icon-btn {
  color: #1d1d1f !important;

  &:hover {
    background-color: rgba(0, 0, 0, 0.04) !important;
  }
}

.admin-btn {
  color: var(--primary-color) !important;

  :deep(.v-icon) {
    color: var(--primary-color) !important;
  }
}

.unlogged_actions {
  display: flex;
}
</style>
