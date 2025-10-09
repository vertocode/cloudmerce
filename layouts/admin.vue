<template>
  <div class="admin-layout">
    <MdHeader />
    <div class="admin-container">
      <!-- Mobile overlay -->
      <div
        v-if="sidebarOpen"
        class="sidebar-overlay"
        @click="sidebarOpen = false"
      />

      <!-- Mobile menu button -->
      <VBtn
        class="mobile-menu-btn"
        icon
        @click="sidebarOpen = !sidebarOpen"
      >
        <VIcon>mdi-menu</VIcon>
      </VBtn>

      <aside
        class="admin-sidebar"
        :class="{ open: sidebarOpen }"
        @click="handleSidebarClick"
      >
        <div class="sidebar-header">
          <VIcon
            size="32"
            color="var(--primary-color)"
          >
            mdi-shield-crown
          </VIcon>
          <h2>Painel Admin</h2>
        </div>

        <nav class="sidebar-nav">
          <NuxtLink
            to="/admin"
            class="nav-item"
            exact
            active-class="active-route"
          >
            <VIcon size="20">
              mdi-view-dashboard
            </VIcon>
            <span>Dashboard</span>
          </NuxtLink>

          <div class="nav-section">
            <h3 class="nav-section-title">
              Produtos
            </h3>
            <NuxtLink
              to="/admin/products"
              class="nav-item"
              active-class="active-route"
            >
              <VIcon size="20">
                mdi-package-variant
              </VIcon>
              <span>Todos os Produtos</span>
            </NuxtLink>
            <NuxtLink
              to="/admin/products/new"
              class="nav-item"
              active-class="active-route"
            >
              <VIcon size="20">
                mdi-plus-circle
              </VIcon>
              <span>Cadastrar Produto</span>
            </NuxtLink>
            <NuxtLink
              to="/admin/product-types"
              class="nav-item"
              active-class="active-route"
            >
              <VIcon size="20">
                mdi-shape
              </VIcon>
              <span>Tipos de Produto</span>
            </NuxtLink>
          </div>

          <div class="nav-section">
            <h3 class="nav-section-title">
              Pedidos
            </h3>
            <NuxtLink
              to="/admin/orders"
              class="nav-item"
              active-class="active-route"
            >
              <VIcon size="20">
                mdi-receipt-text
              </VIcon>
              <span>Todos os Pedidos</span>
            </NuxtLink>
          </div>

          <div class="nav-section">
            <h3 class="nav-section-title">
              Configurações
            </h3>
            <NuxtLink
              to="/admin/settings"
              class="nav-item"
              active-class="active-route"
            >
              <VIcon size="20">
                mdi-cog
              </VIcon>
              <span>Configurar E-Commerce</span>
            </NuxtLink>
          </div>
        </nav>

        <div class="sidebar-footer">
          <NuxtLink
            to="/"
            class="back-to-store"
          >
            <VIcon size="18">
              mdi-storefront
            </VIcon>
            <span>Voltar para Loja</span>
          </NuxtLink>
        </div>
      </aside>

      <main class="admin-content">
        <VContainer class="admin-container-inner">
          <slot />
        </VContainer>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['03-admin-auth'],
})

const sidebarOpen = ref(false)
const route = useRoute()

// Close sidebar when clicking a link (on mobile)
const handleSidebarClick = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  // Check if clicked element is a link or inside a link
  if (target.tagName === 'A' || target.closest('a')) {
    if (window.innerWidth <= 960) {
      sidebarOpen.value = false
    }
  }
}

// Close sidebar when route changes (mobile)
watch(() => route.path, () => {
  if (window.innerWidth <= 960) {
    sidebarOpen.value = false
  }
})
</script>

<style scoped lang="scss">
.admin-layout {
  min-height: 100vh;
  background-color: #f5f5f7;
}

.admin-container {
  display: flex;
  min-height: calc(100vh - 64px);
  position: relative;
}

.sidebar-overlay {
  display: none;

  @media (max-width: 960px) {
    display: block;
    position: fixed;
    top: 64px;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999;
    backdrop-filter: blur(2px);
  }
}

.mobile-menu-btn {
  display: none;
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 1001;
  background-color: var(--primary-color) !important;
  color: white !important;

  @media (max-width: 960px) {
    display: flex;
  }
}

.admin-sidebar {
  width: 280px;
  background-color: #fff;
  border-right: 1px solid #e5e5e7;
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;

  @media (max-width: 960px) {
    position: fixed;
    left: -280px;
    top: 0;
    height: 100vh;
    z-index: 1000;
    transition: left 0.3s ease;
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);

    &.open {
      left: 0;
    }
  }
}

.sidebar-header {
  padding: 24px 20px;
  border-bottom: 1px solid #e5e5e7;
  display: flex;
  align-items: center;
  gap: 12px;

  h2 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1d1d1f;
    margin: 0;
  }
}

.sidebar-nav {
  flex: 1;
  padding: 0 12px 16px 12px;
  overflow-y: auto;

  > .nav-item:first-child {
    margin-top: 0;
    margin-bottom: 8px;
  }

  > .nav-section:first-of-type {
    margin-top: 0;
  }
}

.nav-section {
  margin-bottom: 24px;
  margin-top: 16px;

  &:first-of-type {
    margin-top: 16px;
  }
}

.nav-section-title {
  font-size: 0.75rem;
  font-weight: 600;
  color: #86868b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 8px 12px;
  margin: 0 0 4px 0;

  .nav-section:first-of-type & {
    padding-top: 8px;
  }
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 12px;
  margin-bottom: 4px;
  border-radius: 8px;
  color: #1d1d1f;
  text-decoration: none;
  transition: all 0.2s;
  font-size: 0.875rem;

  &:hover {
    background-color: #f5f5f7;
  }

  &.active-route {
    background-color: rgba(var(--primary-color-rgb), 0.1) !important;
    color: var(--primary-color) !important;
    font-weight: 600;
    border-left: 3px solid var(--primary-color);
    padding-left: 9px;

    :deep(.v-icon) {
      color: var(--primary-color) !important;
    }

    span {
      color: var(--primary-color) !important;
    }
  }

  :deep(.v-icon) {
    color: #86868b;
  }

  span {
    color: #1d1d1f;
  }
}

.sidebar-footer {
  padding: 16px 12px;
  border-top: 1px solid #e5e5e7;
}

.back-to-store {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 8px;
  color: #1d1d1f;
  text-decoration: none;
  font-size: 0.875rem;
  transition: all 0.2s;

  &:hover {
    background-color: #f5f5f7;
  }

  :deep(.v-icon) {
    color: #86868b;
  }
}

.admin-content {
  flex: 1;
  padding: 0;
  overflow-y: auto;

  @media (max-width: 960px) {
    padding: 0;
  }
}

.admin-container-inner {
  padding: 32px 24px !important;
  max-width: 100% !important;

  @media (max-width: 960px) {
    padding: 16px !important;
  }
}
</style>
