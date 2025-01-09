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
          v-bind="props"
        >
          <VIcon>mdi-menu</VIcon>
        </VBtn>
      </template>

      <VList class="navigation-list">
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

        <template v-if="isAdmin">
          <h3 class="admin-subtitle">
            Ações de Administrador
          </h3>
          <VListItem
            class="navigation-item admin-item"
            @click="$router.push('/product-type')"
          >
            <VListItemTitle>Tipos de Produto</VListItemTitle>
          </VListItem>
          <VListItem
            class="navigation-item admin-item"
            @click="$router.push('/register-new-product')"
          >
            <VListItemTitle>Cadastrar Novo Produto</VListItemTitle>
          </VListItem>
          <VListItem
            class="navigation-item admin-item"
            @click="$router.push('/edit-whitelabel')"
          >
            <VListItemTitle>Configurações do E-Commerce</VListItemTitle>
          </VListItem>
        </template>
      </VList>
    </VMenu>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isDrawerOpen = ref(false)

const { userData, isAdmin, logout } = useUser()
</script>

<style scoped>
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

.admin-subtitle {
  padding: 8px 16px;
  font-size: 1rem;
  background-color: var(--secondary-color-700);
  color: #fff;
  pointer-events: none;
}

.admin-item {
  color: var(--secondary-color-700);
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
