<template>
  <div class="payroll-page">
    <div class="page-header">
      <h1 class="page-title">
        Processar Pagamentos
      </h1>
      <p class="page-subtitle">
        Selecione os pedidos para processar o pagamento
      </p>
    </div>

    <VCard class="summary-card">
      <VCardText>
        <div class="summary-content">
          <div class="summary-item">
            <VIcon
              size="32"
              color="primary"
            >
              mdi-cash-multiple
            </VIcon>
            <div>
              <p class="summary-label">
                Total a Pagar
              </p>
              <p class="summary-value">
                {{ formatCurrency(totalAmount) }}
              </p>
            </div>
          </div>
          <div class="summary-item">
            <VIcon
              size="32"
              color="success"
            >
              mdi-checkbox-marked-circle
            </VIcon>
            <div>
              <p class="summary-label">
                Pedidos Selecionados
              </p>
              <p class="summary-value">
                {{ selectedOrders.length }}
              </p>
            </div>
          </div>
          <VBtn
            color="success"
            size="large"
            :disabled="selectedOrders.length === 0"
            :loading="processing"
            @click="processPayment"
          >
            <VIcon
              start
              size="20"
            >
              mdi-cash-check
            </VIcon>
            Pagar
          </VBtn>
        </div>
      </VCardText>
    </VCard>

    <VCard class="orders-card">
      <VCardTitle class="card-title">
        Pedidos Pendentes de Pagamento
      </VCardTitle>
      <VDataTable
        v-model="selectedOrders"
        :headers="headers"
        :items="ordersWithSafeData"
        :loading="loading"
        :items-per-page="pageSize"
        item-value="id"
        show-select
        class="orders-table"
      >
        <template #item.id="{ item }">
          <code class="order-id">{{ item.id }}</code>
        </template>
        <template #item.createdAt="{ item }">
          {{ formatDate(item.createdAt) }}
        </template>
        <template #item.total="{ item }">
          <span class="order-total">{{ formatCurrency(item.total) }}</span>
        </template>
        <template #item.status="{ item }">
          <VChip
            :color="getStatusColor(item.status)"
            size="small"
            label
          >
            {{ getStatusLabel(item.status) }}
          </VChip>
        </template>
        <template #item.itemsCount="{ item }">
          <VChip
            color="primary"
            size="small"
            label
          >
            {{ item.itemsCount }} items
          </VChip>
        </template>
      </VDataTable>

      <div
        v-if="totalPages > 1"
        class="pagination-container"
      >
        <div class="pagination-controls">
          <VBtn
            :disabled="currentPage === 1"
            icon
            size="small"
            @click="onChangePage(currentPage - 1)"
          >
            <VIcon>mdi-chevron-left</VIcon>
          </VBtn>
          <span class="pagination-info">
            Página {{ currentPage }} de {{ totalPages }}
          </span>
          <VBtn
            :disabled="currentPage === totalPages"
            icon
            size="small"
            @click="onChangePage(currentPage + 1)"
          >
            <VIcon>mdi-chevron-right</VIcon>
          </VBtn>
        </div>

        <VSelect
          v-model="pageSize"
          :items="[10, 25, 50, 100]"
          label="Itens por página"
          density="compact"
          variant="outlined"
          hide-details
          class="page-size-selector"
          @update:model-value="onPageSizeChange"
        />
      </div>
    </VCard>

    <VDialog
      v-model="confirmDialog"
      max-width="500"
    >
      <VCard>
        <VCardTitle class="dialog-title">
          Confirmar Pagamento
        </VCardTitle>
        <VCardText>
          <p class="dialog-text">
            Você está prestes a processar o pagamento de <strong>{{ selectedOrders.length }}</strong> pedidos no valor total de <strong>{{ formatCurrency(totalAmount) }}</strong>.
          </p>
          <p class="dialog-warning">
            Esta ação não pode ser desfeita. Deseja continuar?
          </p>
        </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn
            variant="text"
            @click="confirmDialog = false"
          >
            Cancelar
          </VBtn>
          <VBtn
            color="success"
            :loading="processing"
            @click="confirmProcessPayment"
          >
            Confirmar Pagamento
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>

<script setup lang="ts">
import type { Order } from '~/types/order'

definePageMeta({
  layout: 'admin',
  middleware: ['superadmin'],
})

const { get, post } = useApi()
const { whitelabel } = useWhitelabel()

const loading = ref(false)
const processing = ref(false)
const orders = ref<Order[]>([])
const selectedOrders = ref<string[]>([])
const currentPage = ref(1)
const pageSize = ref(25)
const totalPages = ref(0)
const totalItems = ref(0)
const confirmDialog = ref(false)

const headers = [
  { title: 'ID do Pedido', key: 'id', sortable: false },
  { title: 'Data', key: 'createdAt', sortable: true },
  { title: 'Total', key: 'total', sortable: true },
  { title: 'Status', key: 'status', sortable: true },
  { title: 'Items', key: 'itemsCount', sortable: false },
]

const ordersWithSafeData = computed(() => {
  return orders.value.map(order => {
    let total = 0
    let itemsCount = 0

    if (order.items && Array.isArray(order.items)) {
      order.items.forEach((item) => {
        itemsCount += item.quantity || 1
        if (item.productId && typeof item.productId === 'object' && item.productId.price) {
          total += item.productId.price * (item.quantity || 1)
        }
      })
    }

    // Fallback to paymentData total
    if (total === 0 && order.paymentData?.totalAmount) {
      total = order.paymentData.totalAmount
    }

    return {
      id: order._id,
      createdAt: order.createdAt,
      status: order.status,
      total,
      itemsCount,
    }
  })
})

const totalAmount = computed(() => {
  return ordersWithSafeData.value
    .filter(order => selectedOrders.value.includes(order.id))
    .reduce((sum, order) => sum + order.total, 0)
})

const fetchOrders = async () => {
  loading.value = true
  try {
    if (!whitelabel.value?._id) {
      console.error('[Payroll] No whitelabel ID available')
      orders.value = []
      return
    }

    const ecommerceId = String(whitelabel.value._id)
    console.log('[Payroll] Fetching orders for ecommerceId:', ecommerceId, 'page:', currentPage.value, 'pageSize:', pageSize.value)

    const response = await get(`/payroll-orders/${ecommerceId}`, {
      page: String(currentPage.value),
      pageSize: String(pageSize.value),
    }) as { orders: Order[], totalPages: number, totalOrders: number }

    console.log('[Payroll] Response:', response)

    orders.value = response.orders || []
    totalPages.value = response.totalPages || 0
    totalItems.value = response.totalOrders || 0
  }
  catch (err) {
    console.error('[Payroll] Error:', err)
    handleError('Erro ao buscar pedidos')
    orders.value = []
  }
  finally {
    loading.value = false
  }
}

const onChangePage = (page: number) => {
  currentPage.value = page
  fetchOrders()
}

const onPageSizeChange = () => {
  currentPage.value = 1
  fetchOrders()
}

const processPayment = () => {
  confirmDialog.value = true
}

const confirmProcessPayment = async () => {
  processing.value = true
  try {
    if (!whitelabel.value?._id) {
      handleError('Erro ao processar pagamento: ID da loja não encontrado')
      return
    }

    const ecommerceId = String(whitelabel.value._id)

    console.log('[Payroll] Processing payment for orders:', selectedOrders.value)

    const response = await post('/process-payroll', {
      orderIds: selectedOrders.value,
      ecommerceId,
    }) as { modifiedCount: number, totalAmount: number, message: string }

    console.log('[Payroll] Payment processed:', response)

    handleSuccess(`${response.modifiedCount} pedidos marcados como pagos com sucesso!`)

    // Reset selection and refresh
    selectedOrders.value = []
    confirmDialog.value = false
    fetchOrders()
  }
  catch (err) {
    console.error('[Payroll] Error processing payment:', err)
    handleError('Erro ao processar pagamento')
  }
  finally {
    processing.value = false
  }
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    pending: 'warning',
    paid: 'success',
    product_sent: 'info',
    finished: 'grey',
  }
  return colors[status] || 'grey'
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    pending: 'Pendente',
    paid: 'Pago',
    product_sent: 'Enviado',
    finished: 'Finalizado',
  }
  return labels[status] || status
}

// Load orders on mount
onMounted(() => {
  fetchOrders()
})
</script>

<style scoped lang="scss">
.payroll-page {
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 32px;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1d1d1f;
  margin: 0 0 8px 0;
}

.page-subtitle {
  font-size: 1rem;
  color: #86868b;
  margin: 0;
}

.summary-card {
  margin-bottom: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;

  :deep(.v-card-text) {
    padding: 32px !important;
  }

  .summary-content {
    display: grid;
    grid-template-columns: 1fr 1fr auto;
    gap: 32px;
    align-items: center;

    @media (max-width: 960px) {
      grid-template-columns: 1fr;
      gap: 24px;
    }
  }

  .summary-item {
    display: flex;
    align-items: center;
    gap: 16px;

    :deep(.v-icon) {
      background-color: rgba(255, 255, 255, 0.2);
      padding: 12px;
      border-radius: 12px;
    }

    .summary-label {
      font-size: 0.875rem;
      font-weight: 500;
      opacity: 0.9;
      margin: 0 0 4px 0;
    }

    .summary-value {
      font-size: 1.75rem;
      font-weight: 700;
      margin: 0;
    }
  }
}

.orders-card {
  .card-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1d1d1f;
    padding: 20px 24px;
    border-bottom: 1px solid #e5e5e7;
  }

  .orders-table {
    :deep(.v-data-table__th) {
      font-weight: 600;
      color: #1d1d1f;
      background-color: #f5f5f7;
    }
  }
}

.order-id {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.75rem;
  background-color: #f5f5f7;
  padding: 4px 8px;
  border-radius: 4px;
  color: #1d1d1f;
}

.order-total {
  font-weight: 600;
  color: #1d1d1f;
}

.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-top: 1px solid #e5e5e7;
  gap: 16px;

  @media (max-width: 960px) {
    flex-direction: column;
  }
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 16px;

  .pagination-info {
    font-size: 0.875rem;
    color: #86868b;
    min-width: 120px;
    text-align: center;
  }
}

.page-size-selector {
  max-width: 150px;
}

.dialog-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1d1d1f;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e5e7;
}

.dialog-text {
  font-size: 1rem;
  color: #1d1d1f;
  margin: 0 0 16px 0;
  line-height: 1.6;
}

.dialog-warning {
  font-size: 0.875rem;
  color: #ff9500;
  font-weight: 600;
  margin: 0;
}
</style>
