<template>
  <div class="menu-button">
    <VMenu
      v-model="isDrawerOpen"
      offset-y
      close-on-content-click
      class="menu"
      transition="scale-transition"
    >
      <template #activator="{ props }">
        <VBtn
          icon
          class="header-icon-btn"
          v-bind="props"
        >
          <VIcon size="20">mdi-menu</VIcon>
        </VBtn>
      </template>

      <VList class="navigation-list">
        <template v-if="productTypes.length">
          <h3 class="section-subtitle">
            Categorias
          </h3>
          <VListItem
            v-for="type in productTypes"
            :key="type.id"
            class="navigation-item"
            :class="{ active: isActiveType(type.id) }"
            @click="redirectTo(type.id)"
          >
            <VListItemTitle>
              <VIcon
                v-if="type.icon"
                size="18"
              >
                {{ type.icon.includes('mdi') ? type.icon : `mdi-${type.icon}` }}
              </VIcon>
              {{ type.name }}
            </VListItemTitle>
          </VListItem>
          <VDivider class="my-2" />
        </template>

        <VListItem
          class="navigation-item"
          @click="$router.push('/checkout')"
        >
          <VListItemTitle>Carrinho de Compras</VListItemTitle>
        </VListItem>
        <VListItem
          v-if="userData"
          class="navigation-item"
          @click="$router.push('/orders')"
        >
          <VListItemTitle>Meus Pedidos</VListItemTitle>
        </VListItem>
        <VListItem
          class="navigation-item"
          @click="$router.push('/about')"
        >
          <VListItemTitle>Sobre Nós</VListItemTitle>
        </VListItem>
        <VListItem
          class="navigation-item"
          @click="$router.push('/privacy')"
        >
          <VListItemTitle>Política de Privacidade</VListItemTitle>
        </VListItem>
        <VListItem
          class="navigation-item"
          @click="$router.push('/contact')"
        >
          <VListItemTitle>Contato</VListItemTitle>
        </VListItem>
        <VListItem
          v-if="userData"
          class="navigation-item"
          @click="logout"
        >
          <VListItemTitle>Sair da Conta</VListItemTitle>
        </VListItem>

        <VDivider
          v-if="isAdmin"
          class="my-2"
        />
        <VListItem
          v-if="isAdmin"
          class="navigation-item admin-item"
          @click="$router.push('/admin')"
        >
          <VListItemTitle>
            <VIcon size="18">
              mdi-shield-crown
            </VIcon>
            Painel Admin
          </VListItemTitle>
        </VListItem>
      </VList>
    </VMenu>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isDrawerOpen = ref(false)

const { userData, isAdmin, logout } = useUser()
const { productTypes } = useProductTypes()
const router = useRouter()
const route = useRoute()

const redirectTo = (type: string) => {
  router.push(`/product/type/${type}`)
  isDrawerOpen.value = false
}

const isActiveType = (type: string) => route.params.type === type
</script>

<style scoped>
.header-icon-btn {
  color: #1d1d1f !important;
}

.header-icon-btn:hover {
  background-color: rgba(0, 0, 0, 0.04) !important;
}

.menu-button {
  position: relative;
}

.menu {
  background-color: rgba(0, 0, 0, 0.09);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  z-index: 1000;
}

.navigation-list {
  padding: 8px 0;
}

.section-subtitle {
  padding: 8px 16px;
  font-size: 0.875rem;
  font-weight: 600;
  color: #86868b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  pointer-events: none;
  margin-top: 8px;
}

.admin-item {
  :deep(.v-list-item-title) {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--primary-color);
    font-weight: 500;
  }
}

.navigation-item.active {
  background-color: rgba(0, 0, 0, 0.08);
  font-weight: 500;

  :deep(.v-icon) {
    color: var(--primary-color);
  }
}

.navigation-item {
  transition: background-color 0.3s;
  padding: 8px 16px;
  border-radius: 4px;
}

.navigation-item:hover {
  background-color: rgba(0, 0, 0, 0.05);
}
</style>
