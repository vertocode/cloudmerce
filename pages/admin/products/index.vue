<template>
  <div class="admin-products">
    <div class="page-header">
      <h1>Produtos</h1>
      <div class="header-actions">
        <VBtn
          v-if="selected.length > 0"
          color="success"
          variant="elevated"
          class="mr-3"
          @click="exportToCSV"
        >
          <VIcon left>
            mdi-file-export
          </VIcon>
          Exportar Selecionados ({{ selected.length }})
        </VBtn>
        <VBtn
          color="secondary"
          variant="elevated"
          class="mr-3"
          @click="openImportDialog"
        >
          <VIcon left>
            mdi-file-import
          </VIcon>
          Importar CSV
        </VBtn>
        <VBtn
          color="primary"
          @click="$router.push('/admin/products/new')"
        >
          <VIcon left>
            mdi-plus
          </VIcon>
          Cadastrar Produto
        </VBtn>
      </div>
    </div>

    <VCard>
      <VCardText>
        <VTextField
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          label="Buscar produtos"
          single-line
          hide-details
          clearable
          class="mb-4"
        />

        <VDataTable
          v-model="selected"
          :headers="headers"
          :items="products"
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
          <template #item.image="{ item }">
            <VAvatar
              size="48"
              rounded
              class="my-2"
            >
              <VImg
                v-if="getImageUrl(item)"
                :src="getImageUrl(item)"
                :alt="item.name"
                cover
              />
              <VIcon v-else>mdi-image-off</VIcon>
            </VAvatar>
          </template>

          <template #item.price="{ item }">
            {{ formatPrice(item.price) }}
          </template>

          <template #item.stock="{ item }">
            <VChip
              :color="getStockColor(item.stock)"
              size="small"
            >
              {{ getStockLabel(item.stock) }}
            </VChip>
          </template>

          <template #item.productType="{ item }">
            {{ item.productType?.name || '-' }}
          </template>

          <template #item.actions="{ item }">
            <VBtn
              icon
              variant="text"
              size="small"
              @click="$router.push(`/admin/products/${item.id}/edit`)"
            >
              <VIcon>mdi-pencil</VIcon>
              <VTooltip activator="parent">
                Editar
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
                Total: {{ totalItems }} produtos
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
        <VCardTitle>Exportando Produtos</VCardTitle>
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
              Isso pode demorar alguns instantes dependendo da quantidade de produtos.
            </p>
          </div>
        </VCardText>
      </VCard>
    </VDialog>

    <!-- Import Dialog -->
    <VDialog
      v-model="importDialog"
      max-width="500"
      persistent
    >
      <VCard>
        <VCardTitle>Importar Produtos via CSV</VCardTitle>
        <VCardText>
          <p class="mb-4">
            Selecione um arquivo CSV para importar produtos. O arquivo deve estar no mesmo formato do export.
          </p>
          <p class="text-body-2 text-medium-emphasis mb-4">
            Produtos com IDs já existentes serão ignorados.
          </p>
          <VFileInput
            v-model="csvFile"
            label="Arquivo CSV"
            accept=".csv"
            prepend-icon="mdi-file-delimited"
            :disabled="importing"
          />

          <div v-if="importing" class="text-center mt-4">
            <VProgressCircular
              indeterminate
              color="primary"
              size="48"
              class="mb-3"
            />
            <p class="text-body-2">
              Importando produtos... Isso pode demorar alguns instantes.
            </p>
          </div>

          <div v-if="importResult" class="mt-4">
            <VAlert
              :type="importResult.errors && importResult.errors.length > 0 ? 'warning' : 'success'"
              variant="tonal"
            >
              <div class="text-body-1 font-weight-bold mb-2">
                Importação Concluída
              </div>
              <ul>
                <li v-if="importResult.created > 0">{{ importResult.created }} produtos criados</li>
                <li v-if="importResult.skipped > 0">{{ importResult.skipped }} produtos ignorados (já existentes)</li>
                <li v-if="importResult.errors && importResult.errors.length > 0" class="text-error">
                  {{ importResult.errors.length }} erros encontrados
                </li>
              </ul>
              <div v-if="importResult.errors && importResult.errors.length > 0" class="mt-3">
                <VExpansionPanels>
                  <VExpansionPanel>
                    <VExpansionPanelTitle>
                      Ver Erros
                    </VExpansionPanelTitle>
                    <VExpansionPanelText>
                      <ul class="text-body-2">
                        <li v-for="(error, idx) in importResult.errors" :key="idx">
                          {{ error }}
                        </li>
                      </ul>
                    </VExpansionPanelText>
                  </VExpansionPanel>
                </VExpansionPanels>
              </div>
            </VAlert>
          </div>
        </VCardText>

        <VCardActions>
          <VSpacer />
          <VBtn
            variant="text"
            @click="closeImportDialog"
            :disabled="importing"
          >
            {{ importResult ? 'Fechar' : 'Cancelar' }}
          </VBtn>
          <VBtn
            v-if="!importResult"
            color="primary"
            @click="importFromCSV"
            :disabled="!csvFile || importing"
            :loading="importing"
          >
            Importar
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

const { products, loading, update, currentPage, totalPages, totalItems, onChangePage } = useProductList(undefined, { disableWatchers: true })

// Selection
const selected = ref<any[]>([])

// Search
const search = ref('')

// Pagination
const itemsPerPage = ref(25)

// Export dialog
const exportDialog = ref(false)

// Import dialog
const importDialog = ref(false)
const importing = ref(false)
const csvFile = ref<File[] | null>(null)
const importResult = ref<{ created: number; skipped: number; errors?: string[] } | null>(null)

// Headers configuration
const headers = [
  { title: 'Imagem', key: 'image', sortable: false },
  { title: 'Nome', key: 'name', sortable: true },
  { title: 'Preço', key: 'price', sortable: true },
  { title: 'Estoque', key: 'stock', sortable: true },
  { title: 'Tipo', key: 'productType', sortable: false },
  { title: 'Ações', key: 'actions', sortable: false, align: 'end' },
]

// Format price
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price)
}

// Get image URL from product
const getImageUrl = (item: any) => {
  if (Array.isArray(item.image) && item.image.length > 0) {
    return item.image[0]
  }
  if (typeof item.image === 'string' && item.image) {
    return item.image
  }
  return null
}

// Get stock label
const getStockLabel = (stock: any) => {
  if (!stock || typeof stock !== 'object') {
    return '-'
  }
  if (stock.type === 'UNLIMITED') {
    return 'Ilimitado'
  }
  if (stock.type === 'OUT_OF_STOCK') {
    return 'Esgotado'
  }
  if (stock.type === 'LIMITED') {
    return stock.quantity || 0
  }
  return '-'
}

// Get stock color
const getStockColor = (stock: any) => {
  if (!stock || typeof stock !== 'object') {
    return 'grey'
  }
  if (stock.type === 'UNLIMITED') {
    return 'success'
  }
  if (stock.type === 'OUT_OF_STOCK') {
    return 'error'
  }
  if (stock.type === 'LIMITED') {
    return stock.quantity > 0 ? 'success' : 'error'
  }
  return 'grey'
}

// Handle page change
const onPageChange = (page: number) => {
  currentPage.value = page
  onChangePage(page)
}

// Handle items per page change
const onItemsPerPageChange = (perPage: number) => {
  itemsPerPage.value = perPage
  // Reset to first page and update with new limit
  currentPage.value = 1
  update({ cache: 'no-cache', limit: perPage, search: search.value || undefined })
}

// Watch search changes with debounce
let searchTimeout: NodeJS.Timeout
watch(search, (newSearch) => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    update({ cache: 'no-cache', limit: itemsPerPage.value, search: newSearch || undefined })
  }, 500)
})

// Export to CSV using backend
const exportToCSV = async () => {
  if (selected.value.length === 0) {
    handleWarning('Selecione pelo menos um produto para exportar')
    return
  }

  exportDialog.value = true

  try {
    const { whitelabel } = useWhitelabel()
    const { post } = useApi()

    // Call backend to generate CSV
    const response = await post(`/products/export-csv/${whitelabel.value._id}`, {
      productIds: selected.value,
    }, {
      responseType: 'text',
    })

    // Create blob from response and trigger download
    const blob = new Blob([response], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)

    link.setAttribute('href', url)
    link.setAttribute('download', `produtos_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    handleSuccess(`${selected.value.length} produtos exportados com sucesso`)

    // Clear selection after export
    selected.value = []
  } catch (error) {
    console.error('Error exporting CSV:', error)
    handleError('Erro ao exportar produtos')
  } finally {
    exportDialog.value = false
  }
}

// Open import dialog
const openImportDialog = () => {
  importDialog.value = true
  csvFile.value = null
  importResult.value = null
}

// Close import dialog
const closeImportDialog = () => {
  importDialog.value = false
  csvFile.value = null
  importResult.value = null
  // Refresh products list if any were created
  if (importResult.value && importResult.value.created > 0) {
    update({ cache: 'no-cache', limit: itemsPerPage.value })
  }
}

// Import from CSV using backend
const importFromCSV = async () => {
  if (!csvFile.value || csvFile.value.length === 0) {
    handleWarning('Selecione um arquivo CSV')
    return
  }

  importing.value = true
  importResult.value = null

  try {
    const { whitelabel } = useWhitelabel()
    const { post } = useApi()

    // Create FormData to upload file
    const formData = new FormData()
    formData.append('csvFile', csvFile.value[0])

    // Call backend to import CSV
    const response = await post(`/products/import-csv/${whitelabel.value._id}`, formData, {
      useFormData: true,
    })

    importResult.value = {
      created: response.created || 0,
      skipped: response.skipped || 0,
      errors: response.errors,
    }

    if (response.created > 0) {
      handleSuccess(`${response.created} produtos importados com sucesso`)
    } else if (response.skipped > 0 && response.created === 0) {
      handleWarning('Todos os produtos já existem')
    }
  } catch (error) {
    console.error('Error importing CSV:', error)
    handleError('Erro ao importar produtos')
  } finally {
    importing.value = false
  }
}

onMounted(() => {
  update({ cache: 'no-cache', limit: itemsPerPage.value })
})
</script>

<style scoped lang="scss">
.admin-products {
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
}
</style>
