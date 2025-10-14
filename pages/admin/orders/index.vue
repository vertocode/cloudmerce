<template>
  <div class="admin-orders">
    <div class="page-header">
      <h1>Todos os Pedidos</h1>
      <div class="header-actions">
        <VBtn
          v-if="selected.length > 0"
          color="success"
          variant="elevated"
          @click="exportToCSV"
        >
          <VIcon left>
            mdi-file-export
          </VIcon>
          Exportar Selecionados ({{ selected.length }})
        </VBtn>
      </div>
    </div>

    <VCard>
      <VCardText>
        <VTextField
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          label="Buscar pedidos (ID, status)"
          single-line
          hide-details
          clearable
          class="mb-4"
        />

        <VDataTable
          v-model="selected"
          :headers="headers"
          :items="ordersWithSafeData"
          :loading="loading"
          :items-per-page="itemsPerPage"
          :page="currentPage"
          :items-length="totalItems"
          show-select
          item-value="id"
          class="elevation-0"
          @update:page="onPageChange"
          @update:items-per-page="onItemsPerPageChange"
        >
          <template #item.attention="{ item }">
            <VBtn
              v-if="item.hasErrors"
              icon
              variant="text"
              size="small"
              color="error"
              @click="showErrorDetails(item)"
            >
              <VIcon>mdi-alert-circle</VIcon>
              <VTooltip activator="parent">
                Este pedido precisa de atenção
              </VTooltip>
            </VBtn>
          </template>

          <template #item.id="{ item }">
            <span class="text-caption font-mono">{{ item.id.substring(0, 8) }}...</span>
          </template>

          <template #item.status="{ item }">
            <VChip
              :color="getStatusColor(item.status)"
              size="small"
            >
              {{ getStatusLabel(item.status) }}
            </VChip>
          </template>

          <template #item.total="{ item }">
            {{ formatPrice(item.total) }}
          </template>

          <template #item.itemsCount="{ item }">
            <VChip size="small" variant="tonal">
              {{ item.itemsCount }} {{ item.itemsCount === 1 ? 'item' : 'itens' }}
            </VChip>
          </template>

          <template #item.createdAt="{ item }">
            {{ formatDate(item.createdAt) }}
          </template>

          <template #item.paymentType="{ item }">
            <VIcon :color="item.paymentType === 'pix' ? 'success' : 'primary'" size="small">
              {{ item.paymentType === 'pix' ? 'mdi-qrcode' : 'mdi-credit-card' }}
            </VIcon>
            {{ item.paymentType === 'pix' ? 'PIX' : 'Cartão' }}
          </template>

          <template #item.actions="{ item }">
            <VBtn
              icon
              variant="text"
              size="small"
              @click="$router.push(`/orders/${item.id}`)"
            >
              <VIcon>mdi-eye</VIcon>
              <VTooltip activator="parent">
                Ver Detalhes
              </VTooltip>
            </VBtn>
          </template>

          <template #bottom>
            <div class="d-flex justify-space-between align-center pa-3">
              <VSelect
                v-model="itemsPerPage"
                :items="[10, 25, 50, 100]"
                label="Itens por página"
                density="compact"
                style="max-width: 150px"
                hide-details
              />

              <VPagination
                v-model="currentPage"
                :length="totalPages"
                :total-visible="7"
              />

              <div class="text-body-2">
                Total: {{ totalItems }} pedidos
              </div>
            </div>
          </template>
        </VDataTable>
      </VCardText>
    </VCard>

    <!-- Export Loading Dialog -->
    <VDialog
      v-model="exportDialog"
      max-width="400"
      persistent
    >
      <VCard>
        <VCardTitle>Exportando Pedidos</VCardTitle>
        <VCardText>
          <div class="text-center py-4">
            <VProgressCircular
              indeterminate
              color="primary"
              size="64"
              class="mb-4"
            />
            <p class="text-body-1">
              Gerando arquivo CSV...
            </p>
            <p class="text-body-2 text-medium-emphasis">
              Isso pode demorar alguns instantes dependendo da quantidade de pedidos.
            </p>
          </div>
        </VCardText>
      </VCard>
    </VDialog>

    <!-- Error Details Modal -->
    <VDialog
      v-model="errorModal"
      max-width="700"
    >
      <VCard>
        <VCardTitle class="d-flex align-center">
          <VIcon color="error" class="mr-2">
            mdi-alert-circle
          </VIcon>
          Detalhes do Problema - Pedido #{{ selectedOrderError?.id?.substring(0, 8) }}
        </VCardTitle>

        <VDivider />

        <VCardText class="pt-4">
          <VAlert
            type="error"
            variant="tonal"
            class="mb-4"
          >
            <div class="text-body-1 font-weight-bold mb-2">
              Este pedido possui {{ selectedOrderError?.errors?.length || 0 }} problema(s):
            </div>
          </VAlert>

          <div class="mb-4">
            <h3 class="text-h6 mb-3">Problemas Identificados:</h3>
            <VList>
              <VListItem
                v-for="(error, idx) in selectedOrderError?.errors"
                :key="idx"
                class="px-0"
              >
                <template #prepend>
                  <VIcon color="error" class="mr-2">
                    mdi-alert
                  </VIcon>
                </template>
                <VListItemTitle>{{ error }}</VListItemTitle>
              </VListItem>
            </VList>
          </div>

          <div v-if="selectedOrderError?.missingProducts?.length > 0" class="mb-4">
            <h3 class="text-h6 mb-3">Produtos com Problema:</h3>
            <VTable density="compact">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>ID do Produto</th>
                  <th>Nome</th>
                  <th>Quantidade</th>
                  <th>Variantes</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="product in selectedOrderError.missingProducts"
                  :key="product.index"
                >
                  <td>{{ product.index }}</td>
                  <td class="font-mono text-caption">
                    {{ product.productId || 'N/A' }}
                  </td>
                  <td>{{ product.productName || 'Produto não encontrado' }}</td>
                  <td>{{ product.quantity }}</td>
                  <td>
                    <VChip
                      v-if="product.fieldValues?.length > 0"
                      size="x-small"
                      variant="tonal"
                    >
                      {{ product.fieldValues.length }} variante(s)
                    </VChip>
                    <span v-else class="text-caption text-medium-emphasis">-</span>
                  </td>
                </tr>
              </tbody>
            </VTable>
          </div>

          <div class="mb-4">
            <h3 class="text-h6 mb-3">Informações do Pedido:</h3>
            <VList density="compact">
              <VListItem>
                <template #prepend>
                  <VIcon class="mr-2">mdi-identifier</VIcon>
                </template>
                <VListItemTitle>ID Completo</VListItemTitle>
                <VListItemSubtitle class="font-mono">{{ selectedOrderError?.id }}</VListItemSubtitle>
              </VListItem>
              <VListItem>
                <template #prepend>
                  <VIcon class="mr-2">mdi-cash</VIcon>
                </template>
                <VListItemTitle>Total do Pedido</VListItemTitle>
                <VListItemSubtitle>{{ formatPrice(selectedOrderError?.total || 0) }}</VListItemSubtitle>
              </VListItem>
              <VListItem>
                <template #prepend>
                  <VIcon class="mr-2">mdi-calendar</VIcon>
                </template>
                <VListItemTitle>Data de Criação</VListItemTitle>
                <VListItemSubtitle>{{ formatDate(selectedOrderError?.createdAt) }}</VListItemSubtitle>
              </VListItem>
              <VListItem>
                <template #prepend>
                  <VIcon class="mr-2">mdi-credit-card</VIcon>
                </template>
                <VListItemTitle>Tipo de Pagamento</VListItemTitle>
                <VListItemSubtitle>{{ selectedOrderError?.paymentType }}</VListItemSubtitle>
              </VListItem>
            </VList>
          </div>

          <VAlert
            type="info"
            variant="tonal"
            class="mt-4"
          >
            <div class="text-body-2">
              <strong>Recomendações:</strong>
              <ul class="mt-2">
                <li>Verifique se os produtos foram excluídos do sistema</li>
                <li>Considere recriar os produtos ou atualizar o pedido</li>
                <li>Entre em contato com o cliente para resolver o problema</li>
                <li>Mantenha um registro deste pedido para auditoria</li>
              </ul>
            </div>
          </VAlert>
        </VCardText>

        <VDivider />

        <VCardActions>
          <VBtn
            color="primary"
            variant="text"
            @click="$router.push(`/orders/${selectedOrderError?.id}`)"
          >
            <VIcon left>mdi-open-in-new</VIcon>
            Ver Pedido Completo
          </VBtn>
          <VSpacer />
          <VBtn
            variant="text"
            @click="errorModal = false"
          >
            Fechar
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['03-admin-auth'],
})

const { orders, loading, totalPages, totalItems, currentPage, onChangePage } = useAllOrders()

// Selection
const selected = ref<any[]>([])

// Search
const search = ref('')

// Pagination
const itemsPerPage = ref(25)

// Export dialog
const exportDialog = ref(false)

// Error modal
const errorModal = ref(false)
const selectedOrderError = ref<any>(null)

// Headers configuration
const headers = [
  { title: '', key: 'attention', sortable: false, width: '50px' },
  { title: 'ID', key: 'id', sortable: false },
  { title: 'Status', key: 'status', sortable: true },
  { title: 'Total', key: 'total', sortable: true },
  { title: 'Itens', key: 'itemsCount', sortable: false },
  { title: 'Pagamento', key: 'paymentType', sortable: false },
  { title: 'Data', key: 'createdAt', sortable: true },
  { title: 'Ações', key: 'actions', sortable: false, align: 'end' },
]

// Transform orders to safe data structure
const ordersWithSafeData = computed(() => {
  return orders.value.map(order => {
    // Calculate total safely and detect errors
    let total = 0
    let itemsCount = 0
    const errors: string[] = []
    const missingProducts: any[] = []

    if (order.items && Array.isArray(order.items)) {
      order.items.forEach((item, index) => {
        if (!item.productId) {
          errors.push(`Item ${index + 1}: Produto não encontrado (ID do produto está nulo)`)
          missingProducts.push({
            index: index + 1,
            quantity: item.quantity || 0,
            fieldValues: item.fieldValues || [],
          })
        } else if (typeof item.productId !== 'object') {
          errors.push(`Item ${index + 1}: Produto não foi carregado corretamente (ID: ${item.productId})`)
          missingProducts.push({
            index: index + 1,
            productId: item.productId,
            quantity: item.quantity || 0,
            fieldValues: item.fieldValues || [],
          })
        } else if (!item.productId.price) {
          errors.push(`Item ${index + 1}: Produto sem preço definido (${item.productId.name || 'Nome não disponível'})`)
          missingProducts.push({
            index: index + 1,
            productId: item.productId._id,
            productName: item.productId.name || 'Nome não disponível',
            quantity: item.quantity || 0,
            fieldValues: item.fieldValues || [],
          })
        } else {
          total += item.productId.price * (item.quantity || 1)
          itemsCount += item.quantity || 1
        }
      })
    }

    // Fallback to paymentData total if calculated total is 0
    if (total === 0 && order.paymentData?.totalAmount) {
      total = order.paymentData.totalAmount
      if (errors.length === 0) {
        errors.push('Total calculado a partir dos dados de pagamento (produtos podem estar faltando)')
      }
    }

    // Check for other potential issues
    if (!order.paymentData?.totalAmount) {
      errors.push('Dados de pagamento incompletos')
    }

    if (!order.items || order.items.length === 0) {
      errors.push('Pedido sem itens')
    }

    return {
      id: order._id,
      status: order.status,
      total,
      itemsCount,
      paymentType: order.paymentData?.type || 'N/A',
      createdAt: order.createdAt,
      hasErrors: errors.length > 0,
      errors,
      missingProducts,
      rawOrder: order,
    }
  })
})

// Format price
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price)
}

// Format date
const formatDate = (date: string | Date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Get status label
const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    pending: 'Pendente',
    paid: 'Pago',
    product_sent: 'Enviado',
    finished: 'Finalizado',
  }
  return labels[status] || status
}

// Get status color
const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    pending: 'warning',
    paid: 'success',
    product_sent: 'info',
    finished: 'grey',
  }
  return colors[status] || 'grey'
}

// Handle page change
const onPageChange = (page: number) => {
  currentPage.value = page
  onChangePage(page)
}

// Handle items per page change
const onItemsPerPageChange = (perPage: number) => {
  itemsPerPage.value = perPage
  currentPage.value = 1
  useAllOrders().fetchOrders({ page: 1, pageSize: perPage })
}

// Watch search changes with debounce
let searchTimeout: NodeJS.Timeout
watch(search, (newSearch) => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    useAllOrders().fetchOrders({ page: 1, pageSize: itemsPerPage.value, search: newSearch || undefined })
  }, 500)
})

// Show error details modal
const showErrorDetails = (order: any) => {
  selectedOrderError.value = order
  errorModal.value = true
}

// Export to CSV
const exportToCSV = async () => {
  if (selected.value.length === 0) {
    handleWarning('Selecione pelo menos um pedido para exportar')
    return
  }

  exportDialog.value = true

  try {
    // Get selected orders
    const selectedOrders = ordersWithSafeData.value.filter(o => selected.value.includes(o.id))

    // Generate CSV content
    const csvHeaders = ['ID do Pedido', 'Status', 'Total', 'Quantidade de Itens', 'Tipo de Pagamento', 'Data']
    const csvRows = selectedOrders.map(order => {
      return [
        order.id,
        getStatusLabel(order.status),
        order.total.toFixed(2),
        order.itemsCount,
        order.paymentType === 'pix' ? 'PIX' : 'Cartão de Crédito',
        formatDate(order.createdAt),
      ].join(',')
    })

    const csvContent = [csvHeaders.join(','), ...csvRows].join('\n')
    const csvWithBOM = '\uFEFF' + csvContent

    // Create blob and trigger download
    const blob = new Blob([csvWithBOM], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)

    link.setAttribute('href', url)
    link.setAttribute('download', `pedidos_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    handleSuccess(`${selected.value.length} pedidos exportados com sucesso`)

    // Clear selection after export
    selected.value = []
  } catch (error) {
    console.error('Error exporting CSV:', error)
    handleError('Erro ao exportar pedidos')
  } finally {
    exportDialog.value = false
  }
}

onMounted(() => {
  useAllOrders().fetchOrders({ page: 1, pageSize: itemsPerPage.value })
})
</script>

<style scoped lang="scss">
.admin-orders {
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;

    h1 {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1d1d1f;
      margin: 0;
    }

    .header-actions {
      display: flex;
      gap: 12px;
      align-items: center;
    }

    @media (max-width: 600px) {
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;

      .header-actions {
        width: 100%;
        flex-direction: column;

        button {
          width: 100%;
        }
      }
    }
  }

  .font-mono {
    font-family: monospace;
  }
}
</style>
