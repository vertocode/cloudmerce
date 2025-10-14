<template>
  <div class="payments-page">
    <div class="page-header">
      <h1 class="page-title">
        Pagamentos
      </h1>
      <p class="page-subtitle">
        Acompanhe os valores que você receberá das suas vendas
      </p>
    </div>

    <VCard class="filter-card">
      <VCardText>
        <div class="filter-section">
          <h3 class="filter-title">
            Filtrar por Data
          </h3>
          <div class="date-filters">
            <VTextField
              v-model="startDate"
              label="Data Inicial"
              type="date"
              density="comfortable"
              variant="outlined"
              hide-details
            />
            <VTextField
              v-model="endDate"
              label="Data Final"
              type="date"
              density="comfortable"
              variant="outlined"
              hide-details
            />
            <VBtn
              color="primary"
              size="large"
              :loading="loading"
              @click="fetchPaymentAnalytics"
            >
              <VIcon
                start
                size="20"
              >
                mdi-filter
              </VIcon>
              Filtrar
            </VBtn>
            <VBtn
              variant="outlined"
              size="large"
              @click="clearFilters"
            >
              Limpar
            </VBtn>
          </div>
        </div>
      </VCardText>
    </VCard>

    <div
      v-if="loading && !analytics"
      class="loading-container"
    >
      <VProgressCircular
        indeterminate
        size="64"
        color="primary"
      />
    </div>

    <VCard
      v-else-if="analytics && analytics.nextPayrollAmount === 0"
      class="no-payment-card"
    >
      <VCardText>
        <div class="no-payment-content">
          <VIcon
            size="64"
            color="grey-lighten-1"
          >
            mdi-cash-clock
          </VIcon>
          <h3 class="no-payment-title">
            Nenhum pagamento a receber no momento
          </h3>
          <p class="no-payment-text">
            Assim que você tiver pedidos pagos, eles aparecerão aqui e você poderá acompanhar o valor a receber.
          </p>
        </div>
      </VCardText>
    </VCard>

    <div
      v-else-if="analytics"
      class="stats-grid"
    >
      <VCard class="stat-card total-card">
        <VCardText>
          <div class="stat-icon">
            <VIcon
              size="32"
              color="primary"
            >
              mdi-cash-multiple
            </VIcon>
          </div>
          <div class="stat-content">
            <h3 class="stat-label">
              Total de Pedidos
            </h3>
            <p class="stat-value">
              {{ formatCurrency(analytics.totalAmount) }}
            </p>
            <p class="stat-count">
              {{ analytics.totalOrders }} pedidos
            </p>
          </div>
        </VCardText>
      </VCard>

      <VCard class="stat-card payroll-card">
        <VCardText>
          <div class="stat-icon payroll-icon">
            <VIcon
              size="32"
              color="success"
            >
              mdi-calendar-clock
            </VIcon>
          </div>
          <div class="stat-content">
            <h3 class="stat-label">
              Próximo Pagamento
            </h3>
            <p class="stat-value payroll-value">
              {{ formatCurrency(analytics.nextPayrollAmount) }}
            </p>
            <p class="stat-count">
              {{ analytics.nextPayrollOrders }} pedidos
            </p>
          </div>
        </VCardText>
      </VCard>
    </div>

    <VCard
      v-if="analytics && analytics.orders.length > 0"
      class="orders-table-card"
    >
      <VCardTitle class="table-title">
        Detalhes dos Pedidos
      </VCardTitle>
      <VDataTable
        :headers="headers"
        :items="analytics.orders"
        :items-per-page="10"
        class="orders-table"
      >
        <template #item._id="{ item }">
          <code class="order-id">{{ item._id }}</code>
        </template>
        <template #item.total="{ item }">
          <span class="order-total">{{ formatCurrency(item.total) }}</span>
        </template>
        <template #item.createdAt="{ item }">
          {{ formatDate(item.createdAt) }}
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
        <template #item.isNextPayroll="{ item }">
          <VChip
            :color="item.isNextPayroll ? 'success' : 'grey'"
            size="small"
            label
          >
            {{ item.isNextPayroll ? 'Sim' : 'Não' }}
          </VChip>
        </template>
      </VDataTable>
    </VCard>

    <VCard class="history-card">
      <VCardTitle class="table-title">
        Histórico de Pagamentos
      </VCardTitle>
      <VCardText>
        <div class="history-filters">
          <VTextField
            v-model="historyStartDate"
            label="Data Inicial"
            type="date"
            density="comfortable"
            variant="outlined"
            hide-details
          />
          <VTextField
            v-model="historyEndDate"
            label="Data Final"
            type="date"
            density="comfortable"
            variant="outlined"
            hide-details
          />
          <VBtn
            color="primary"
            :loading="historyLoading"
            @click="fetchPayrollHistory"
          >
            <VIcon
              start
              size="20"
            >
              mdi-filter
            </VIcon>
            Filtrar
          </VBtn>
          <VBtn
            variant="outlined"
            @click="clearHistoryFilters"
          >
            Limpar
          </VBtn>
        </div>
      </VCardText>
      <VDataTable
        :headers="historyHeaders"
        :items="payrollHistory"
        :items-per-page="historyPageSize"
        :loading="historyLoading"
        class="history-table"
      >
        <template #item.processedAt="{ item }">
          {{ formatDate(item.processedAt) }}
        </template>
        <template #item.totalAmount="{ item }">
          <span class="history-total">{{ formatCurrency(item.totalAmount) }}</span>
        </template>
        <template #item.ordersCount="{ item }">
          <VChip
            color="primary"
            size="small"
            label
          >
            {{ item.ordersCount }} pedidos
          </VChip>
        </template>
        <template #item.processedBy="{ item }">
          <span v-if="item.processedBy">
            {{ item.processedBy.name || item.processedBy.email }}
          </span>
          <span v-else>
            -
          </span>
        </template>
      </VDataTable>
      <div
        v-if="historyTotalPages > 1"
        class="pagination-controls"
      >
        <VBtn
          :disabled="historyCurrentPage === 1"
          icon
          size="small"
          @click="historyCurrentPage--; fetchPayrollHistory()"
        >
          <VIcon>mdi-chevron-left</VIcon>
        </VBtn>
        <span class="pagination-info">
          Página {{ historyCurrentPage }} de {{ historyTotalPages }}
        </span>
        <VBtn
          :disabled="historyCurrentPage === historyTotalPages"
          icon
          size="small"
          @click="historyCurrentPage++; fetchPayrollHistory()"
        >
          <VIcon>mdi-chevron-right</VIcon>
        </VBtn>
      </div>
    </VCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['03-admin-auth'],
})

const { get } = useApi()
const { whitelabel } = useWhitelabel()

const startDate = ref('')
const endDate = ref('')
const loading = ref(false)
const analytics = ref<{
  totalAmount: number
  nextPayrollAmount: number
  totalOrders: number
  nextPayrollOrders: number
  orders: Array<{
    _id: string
    total: number
    createdAt: string
    status: string
    isNextPayroll: boolean
  }>
} | null>(null)

const headers = [
  { title: 'ID do Pedido', key: '_id', sortable: false },
  { title: 'Total', key: 'total', sortable: true },
  { title: 'Data', key: 'createdAt', sortable: true },
  { title: 'Status', key: 'status', sortable: true },
  { title: 'Próximo Pagamento', key: 'isNextPayroll', sortable: true },
]

const historyHeaders = [
  { title: 'Data do Pagamento', key: 'processedAt', sortable: true },
  { title: 'Valor Total', key: 'totalAmount', sortable: true },
  { title: 'Quantidade de Pedidos', key: 'ordersCount', sortable: true },
  { title: 'Processado Por', key: 'processedBy', sortable: false },
]

const historyStartDate = ref('')
const historyEndDate = ref('')
const historyLoading = ref(false)
const historyCurrentPage = ref(1)
const historyPageSize = ref(10)
const historyTotalPages = ref(0)
const payrollHistory = ref<Array<{
  _id: string
  processedAt: string
  totalAmount: number
  ordersCount: number
  processedBy?: {
    name: string
    email: string
  }
}>>([])

const fetchPayrollHistory = async () => {
  historyLoading.value = true
  try {
    if (!whitelabel.value?._id) {
      console.error('[PayrollHistory] No whitelabel ID available')
      return
    }

    const ecommerceId = String(whitelabel.value._id)
    const params: Record<string, string> = {
      page: String(historyCurrentPage.value),
      pageSize: String(historyPageSize.value),
    }

    if (historyStartDate.value) {
      params.startDate = new Date(historyStartDate.value).toISOString()
    }
    if (historyEndDate.value) {
      params.endDate = new Date(historyEndDate.value).toISOString()
    }

    console.log('[PayrollHistory] Fetching history for:', ecommerceId, params)

    const response = await get(`/payroll-history/${ecommerceId}`, params) as {
      history: typeof payrollHistory.value
      totalRecords: number
      totalPages: number
    }

    payrollHistory.value = response.history || []
    historyTotalPages.value = response.totalPages || 0

    console.log('[PayrollHistory] History:', payrollHistory.value)
  }
  catch (err) {
    console.error('[PayrollHistory] Error:', err)
    handleError('Erro ao buscar histórico de pagamentos')
  }
  finally {
    historyLoading.value = false
  }
}

const clearHistoryFilters = () => {
  historyStartDate.value = ''
  historyEndDate.value = ''
  historyCurrentPage.value = 1
  fetchPayrollHistory()
}

const fetchPaymentAnalytics = async () => {
  loading.value = true
  try {
    if (!whitelabel.value?._id) {
      console.error('[Payments] No whitelabel ID available')
      return
    }

    const ecommerceId = String(whitelabel.value._id)
    const params: Record<string, string> = {}

    if (startDate.value) {
      params.startDate = new Date(startDate.value).toISOString()
    }
    if (endDate.value) {
      params.endDate = new Date(endDate.value).toISOString()
    }

    console.log('[Payments] Fetching analytics for:', ecommerceId, params)

    const response = await get(`/payment-analytics/${ecommerceId}`, params)
    analytics.value = response as typeof analytics.value

    console.log('[Payments] Analytics:', analytics.value)
  }
  catch (err) {
    console.error('[Payments] Error:', err)
    handleError('Erro ao buscar dados de pagamento')
  }
  finally {
    loading.value = false
  }
}

const clearFilters = () => {
  startDate.value = ''
  endDate.value = ''
  fetchPaymentAnalytics()
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

// Load analytics and history on mount
onMounted(() => {
  fetchPaymentAnalytics()
  fetchPayrollHistory()
})
</script>

<style scoped lang="scss">
.payments-page {
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

.filter-card {
  margin-bottom: 24px;
}

.filter-section {
  .filter-title {
    font-size: 1rem;
    font-weight: 600;
    color: #1d1d1f;
    margin: 0 0 16px 0;
  }

  .date-filters {
    display: grid;
    grid-template-columns: 1fr 1fr auto auto;
    gap: 16px;
    align-items: center;

    @media (max-width: 960px) {
      grid-template-columns: 1fr;
    }
  }
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 80px 0;
}

.no-payment-card {
  margin-bottom: 32px;

  .no-payment-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 60px 40px;

    @media (max-width: 960px) {
      padding: 40px 20px;
    }
  }

  .no-payment-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1d1d1f;
    margin: 24px 0 12px 0;
  }

  .no-payment-text {
    font-size: 1rem;
    color: #86868b;
    max-width: 500px;
    margin: 0;
    line-height: 1.6;
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-bottom: 32px;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
}

.stat-card {
  :deep(.v-card-text) {
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 24px !important;
  }

  .stat-icon {
    flex-shrink: 0;
    width: 64px;
    height: 64px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(var(--primary-color-rgb), 0.1);
  }

  .payroll-icon {
    background-color: rgba(76, 175, 80, 0.1);
  }

  .stat-content {
    flex: 1;
  }

  .stat-label {
    font-size: 0.875rem;
    font-weight: 600;
    color: #86868b;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin: 0 0 8px 0;
  }

  .stat-value {
    font-size: 2rem;
    font-weight: 700;
    color: #1d1d1f;
    margin: 0 0 4px 0;
  }

  .payroll-value {
    color: #4caf50;
  }

  .stat-count {
    font-size: 0.875rem;
    color: #86868b;
    margin: 0;
  }
}

.orders-table-card {
  .table-title {
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

.history-card {
  margin-top: 32px;

  .history-filters {
    display: grid;
    grid-template-columns: 1fr 1fr auto auto;
    gap: 16px;
    align-items: center;
    margin-bottom: 16px;

    @media (max-width: 960px) {
      grid-template-columns: 1fr;
    }
  }

  .history-table {
    :deep(.v-data-table__th) {
      font-weight: 600;
      color: #1d1d1f;
      background-color: #f5f5f7;
    }
  }

  .pagination-controls {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    padding: 16px;
    border-top: 1px solid #e5e5e7;

    .pagination-info {
      font-size: 0.875rem;
      color: #86868b;
    }
  }
}

.history-total {
  font-weight: 600;
  color: #1d1d1f;
}
</style>
