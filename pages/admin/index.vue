<template>
  <div class="admin-dashboard">
    <div class="dashboard-header">
      <h1>Dashboard</h1>
      <p class="subtitle">
        Bem-vindo ao painel administrativo
      </p>
    </div>

    <div class="stats-grid">
      <VCard class="stat-card">
        <VCardText>
          <div class="stat-icon products">
            <VIcon size="32">
              mdi-package-variant
            </VIcon>
          </div>
          <div class="stat-content">
            <h3 class="stat-value">
              {{ products.length }}
            </h3>
            <p class="stat-label">
              Produtos Cadastrados
            </p>
          </div>
        </VCardText>
        <VCardActions>
          <VBtn
            color="primary"
            variant="text"
            @click="$router.push('/admin/products')"
          >
            Ver Produtos
          </VBtn>
        </VCardActions>
      </VCard>

      <VCard class="stat-card">
        <VCardText>
          <div class="stat-icon orders">
            <VIcon size="32">
              mdi-receipt-text
            </VIcon>
          </div>
          <div class="stat-content">
            <h3 class="stat-value">
              {{ orders.length }}
            </h3>
            <p class="stat-label">
              Pedidos Totais
            </p>
          </div>
        </VCardText>
        <VCardActions>
          <VBtn
            color="primary"
            variant="text"
            @click="$router.push('/admin/orders')"
          >
            Ver Pedidos
          </VBtn>
        </VCardActions>
      </VCard>

      <VCard class="stat-card">
        <VCardText>
          <div class="stat-icon product-types">
            <VIcon size="32">
              mdi-shape
            </VIcon>
          </div>
          <div class="stat-content">
            <h3 class="stat-value">
              {{ productTypes.length }}
            </h3>
            <p class="stat-label">
              Tipos de Produto
            </p>
          </div>
        </VCardText>
        <VCardActions>
          <VBtn
            color="primary"
            variant="text"
            @click="$router.push('/admin/product-types')"
          >
            Gerenciar Tipos
          </VBtn>
        </VCardActions>
      </VCard>
    </div>

    <div class="quick-actions">
      <h2>Ações Rápidas</h2>
      <div class="actions-grid">
        <VCard
          class="action-card"
          @click="$router.push('/admin/products/new')"
        >
          <VCardText>
            <VIcon
              size="48"
              color="primary"
            >
              mdi-plus-circle
            </VIcon>
            <h3>Cadastrar Produto</h3>
            <p>Adicione um novo produto ao catálogo</p>
          </VCardText>
        </VCard>

        <VCard
          class="action-card"
          @click="$router.push('/admin/product-types')"
        >
          <VCardText>
            <VIcon
              size="48"
              color="primary"
            >
              mdi-shape-plus
            </VIcon>
            <h3>Criar Tipo de Produto</h3>
            <p>Adicione uma nova categoria de produtos</p>
          </VCardText>
        </VCard>

        <VCard
          class="action-card"
          @click="$router.push('/admin/orders')"
        >
          <VCardText>
            <VIcon
              size="48"
              color="primary"
            >
              mdi-receipt-text-check
            </VIcon>
            <h3>Ver Pedidos</h3>
            <p>Gerencie todos os pedidos do e-commerce</p>
          </VCardText>
        </VCard>

        <VCard
          class="action-card"
          @click="$router.push('/admin/settings')"
        >
          <VCardText>
            <VIcon
              size="48"
              color="primary"
            >
              mdi-cog
            </VIcon>
            <h3>Configurações</h3>
            <p>Configure seu e-commerce</p>
          </VCardText>
        </VCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['03-admin-auth'],
})

const { products, update } = useProductList()
const { productTypes } = useProductTypes()
const { orders, loading, fetchOrders } = useAllOrders()

onMounted(async () => {
  await update({ cache: 'no-cache' })
  await fetchOrders()
})
</script>

<style scoped lang="scss">
.admin-dashboard {
  max-width: 1400px;
  margin: 0 auto;
}

.dashboard-header {
  margin-bottom: 32px;

  h1 {
    font-size: 2rem;
    font-weight: 600;
    color: #1d1d1f;
    margin-bottom: 8px;
  }

  .subtitle {
    font-size: 1rem;
    color: #86868b;
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 48px;
}

.stat-card {
  :deep(.v-card-text) {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 24px;
  }
}

.stat-icon {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;

  &.products {
    background-color: rgba(0, 122, 255, 0.1);
    :deep(.v-icon) {
      color: #007aff;
    }
  }

  &.orders {
    background-color: rgba(52, 199, 89, 0.1);
    :deep(.v-icon) {
      color: #34c759;
    }
  }

  &.product-types {
    background-color: rgba(255, 149, 0, 0.1);
    :deep(.v-icon) {
      color: #ff9500;
    }
  }
}

.stat-content {
  flex: 1;

  .stat-value {
    font-size: 2rem;
    font-weight: 700;
    color: #1d1d1f;
    margin-bottom: 4px;
  }

  .stat-label {
    font-size: 0.875rem;
    color: #86868b;
    margin: 0;
  }
}

.quick-actions {
  h2 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1d1d1f;
    margin-bottom: 24px;
  }
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
}

.action-card {
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12) !important;
    border-color: var(--primary-color);
  }

  :deep(.v-card-text) {
    text-align: center;
    padding: 32px 24px;

    h3 {
      font-size: 1.125rem;
      font-weight: 600;
      color: #1d1d1f;
      margin: 16px 0 8px;
    }

    p {
      font-size: 0.875rem;
      color: #86868b;
      margin: 0;
    }
  }
}

@media (max-width: 960px) {
  .dashboard-header h1 {
    font-size: 1.5rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .actions-grid {
    grid-template-columns: 1fr;
  }
}
</style>
