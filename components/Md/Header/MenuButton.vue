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
        <VBtn icon v-bind="props">
          <VIcon>mdi-menu</VIcon>
        </VBtn>
      </template>

      <VList class="navigation-list">
        <VListItem @click="$router.push('/about')" class="navigation-item">
          <VListItemTitle>Sobre Nós</VListItemTitle>
        </VListItem>
        <VListItem @click="$router.push('/privacy')" class="navigation-item">
          <VListItemTitle>Política de Privacidade</VListItemTitle>
        </VListItem>
        <VListItem @click="$router.push('/contact')" class="navigation-item">
          <VListItemTitle>Contato</VListItemTitle>
        </VListItem>
        <VListItem @click="showProductTypeModal = true" class="navigation-item">
          <VListItemTitle>Cadastrar Tipo de Produto</VListItemTitle>
        </VListItem>
        <VListItem @click="showProductModal = true" class="navigation-item">
          <VListItemTitle>Cadastrar Produto</VListItemTitle>
        </VListItem>
        <VListItem @click="showPaletteModal = true" class="navigation-item">
          <VListItemTitle>Configurações de Paleta</VListItemTitle>
        </VListItem>
      </VList>
    </VMenu>
  </div>
  <PaletteModal :show-palette-modal="showPaletteModal" :on-close="() => showPaletteModal = false"/>
  <RegisterProductType :showRegisterModal="showProductTypeModal" :onClose="() => showProductTypeModal = false" />
  <RegisterProduct :showRegisterModal="showProductModal" :onClose="() => showProductModal = false" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import PaletteModal from '~/components/Md/PaletteModal/index.vue'
import RegisterProductType from '~/components/Md/RegisterProductType/index.vue'
import RegisterProduct from '~/components/Md/RegisterProduct/index.vue'

const isDrawerOpen = ref(false)
const showPaletteModal = ref(false)
const showProductTypeModal = ref(false)
const showProductModal = ref(false)
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

.navigation-item {
  transition: background-color 0.3s;
  padding: 8px 16px;
  border-radius: 4px;
}

.navigation-item:hover {
  background-color: rgba(0, 0, 0, 0.05);
}
</style>
