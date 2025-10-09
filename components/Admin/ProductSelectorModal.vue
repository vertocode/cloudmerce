<template>
  <VDialog
    :model-value="modelValue"
    max-width="900"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <VCard>
      <VCardTitle>
        <div class="modal-header">
          <span>Selecionar Produtos</span>
          <VBtn
            icon
            variant="text"
            @click="$emit('update:modelValue', false)"
          >
            <VIcon>mdi-close</VIcon>
          </VBtn>
        </div>
      </VCardTitle>

      <VCardText>
        <!-- Search -->
        <VTextField
          v-model="search"
          placeholder="Buscar produtos..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          class="mb-4"
          clearable
        />

        <!-- Selected Products -->
        <div
          v-if="selectedProductIds.length > 0"
          class="selected-products mb-4"
        >
          <h4>Produtos Selecionados ({{ selectedProductIds.length }})</h4>
          <div class="selected-chips">
            <VChip
              v-for="productId in selectedProductIds"
              :key="productId"
              closable
              @click:close="toggleProduct(productId)"
            >
              {{ getProductName(productId) }}
            </VChip>
          </div>
        </div>

        <!-- Loading State -->
        <div
          v-if="loading"
          class="loading-container"
        >
          <VProgressCircular
            indeterminate
            color="primary"
          />
        </div>

        <!-- Products Grid -->
        <div
          v-else-if="products.length > 0"
          class="products-grid"
        >
          <VCard
            v-for="product in products"
            :key="product.id"
            class="product-card"
            :class="{ selected: selectedProductIds.includes(product.id) }"
            @click="toggleProduct(product.id)"
          >
            <div class="product-image">
              <img
                :src="Array.isArray(product.image) ? product.image[0] : product.image"
                :alt="product.name"
              >
              <VCheckbox
                :model-value="selectedProductIds.includes(product.id)"
                class="product-checkbox"
                @click.stop="toggleProduct(product.id)"
              />
            </div>
            <VCardText>
              <div class="product-name">
                {{ product.name }}
              </div>
              <div class="product-price">
                {{ formatPrice(product.price) }}
              </div>
            </VCardText>
          </VCard>
        </div>

        <!-- Empty State -->
        <div
          v-else
          class="empty-state"
        >
          <VIcon
            size="64"
            color="grey"
          >
            mdi-package-variant-closed
          </VIcon>
          <p>Nenhum produto encontrado</p>
        </div>

        <!-- Pagination -->
        <div
          v-if="totalPages > 1"
          class="pagination-container"
        >
          <VPagination
            v-model="currentPage"
            :length="totalPages"
            :total-visible="5"
          />
        </div>
      </VCardText>

      <VCardActions class="modal-actions">
        <VBtn
          variant="text"
          @click="$emit('update:modelValue', false)"
        >
          Cancelar
        </VBtn>
        <VBtn
          color="primary"
          variant="flat"
          :disabled="selectedProductIds.length === 0"
          @click="confirmSelection"
        >
          Confirmar ({{ selectedProductIds.length }})
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script setup lang="ts">
import type { IProduct } from '~/types/product'

const props = defineProps<{
  modelValue: boolean
  initialSelectedIds?: string[]
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
  (event: 'confirm', productIds: string[]): void
}>()

const { products, loading, totalPages, onChangePage, currentPage } = useProductList()
const search = useState<string>('productSelectorSearch', () => '')
const selectedProductIds = ref<string[]>([...(props.initialSelectedIds || [])])

const toggleProduct = (productId: string) => {
  const index = selectedProductIds.value.indexOf(productId)
  if (index > -1) {
    selectedProductIds.value.splice(index, 1)
  } else {
    selectedProductIds.value.push(productId)
  }
}

const getProductName = (productId: string) => {
  const product = products.value.find(p => p.id === productId)
  return product?.name || productId
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price)
}

const confirmSelection = () => {
  emit('confirm', selectedProductIds.value)
  emit('update:modelValue', false)
}

watch(() => props.modelValue, (value) => {
  if (value) {
    selectedProductIds.value = [...(props.initialSelectedIds || [])]
  }
})
</script>

<style scoped lang="scss">
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.modal-actions {
  justify-content: flex-end;
  gap: 12px;
}

.selected-products {
  h4 {
    font-size: 0.875rem;
    font-weight: 600;
    margin-bottom: 8px;
    color: #1d1d1f;
  }

  .selected-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
}

.loading-container {
  display: flex;
  justify-content: center;
  padding: 48px;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.product-card {
  cursor: pointer;
  transition: all 0.2s;
  border: 2px solid transparent;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  &.selected {
    border-color: var(--primary-color);
    background-color: rgba(var(--v-theme-primary), 0.05);
  }

  .product-image {
    position: relative;
    width: 100%;
    padding-top: 100%;
    overflow: hidden;
    background-color: #f5f5f7;

    img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .product-checkbox {
      position: absolute;
      top: 8px;
      right: 8px;
      background-color: white;
      border-radius: 4px;
    }
  }

  .product-name {
    font-size: 0.875rem;
    font-weight: 500;
    margin-bottom: 4px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .product-price {
    font-size: 0.875rem;
    color: #86868b;
  }
}

.empty-state {
  text-align: center;
  padding: 48px;
  color: #86868b;

  p {
    margin-top: 16px;
  }
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 16px;
}
</style>
