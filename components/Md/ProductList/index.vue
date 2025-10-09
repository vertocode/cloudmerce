<template>
  <div
    v-if="isAdmin && !loading"
    class="new-product-btn-container"
  >
    <VBtn
      color="secondary"
      variant="outlined"
      @click="$router.push('/register-new-product')"
    >
      Novo Produto (ADM)
    </VBtn>
  </div>

  <div
    v-if="!loading && totalItems > 0"
    class="total-items-container"
  >
    <p class="total-items-text">
      {{ totalItems }} {{ totalItems === 1 ? 'produto encontrado' : 'produtos encontrados' }}
    </p>
  </div>

  <div
    v-if="loading"
    class="spinner"
  >
    <VProgressCircular
      indeterminate
      color="var(--primary-color-500)"
      size="50"
    />
  </div>
  <div
    v-else-if="products.length"
    class="product-list"
  >
    <MdProductCard
      v-for="product in products"
      :key="product.id"
      :product
      :update-product-list
    />
  </div>
  <MdNoProducts
    v-else
    @retry="retryFetch"
    @go-home="goToHomePage"
  />
  <PaginationComponent
    v-if="!loading && products.length && totalItems > 12"
    :current-page="currentPage"
    :total-pages="totalPages"
    @page-change="handlePageChange"
  />
</template>

<script setup lang="ts">
import PaginationComponent from './PaginationComponent.vue'
import type { IProduct } from '~/types/product'

const router = useRouter()
const { isAdmin } = useUser()

const props = defineProps<{
  products: IProduct[]
  updateProductList: (param: { cache: 'no-cache' | 'force-cache' }) => Promise<void>
  loading?: boolean
  currentPage: number
  totalPages: number
  totalItems: number
}>()

const emit = defineEmits<{
  (event: 'pageChange', page: number): void
}>()

const retryFetch = async () => {
  await props.updateProductList({ cache: 'no-cache' })
}

const goToHomePage = () => {
  router.push('/')
}

const handlePageChange = (page: number) => {
  emit('pageChange', page)
}
</script>

<style lang="scss">
.new-product-btn-container {
  display: flex;
  width: 100%;
  justify-content: center;
  margin-top: 24px;
}

.total-items-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 16px 0;
  padding: 12px;
  background-color: #f5f5f7;
  border-radius: 8px;

  .total-items-text {
    margin: 0;
    font-size: 0.95rem;
    font-weight: 500;
    color: #1d1d1f;
  }
}

.spinner {
  margin: auto;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
}

.product-list {
  display: grid;
  gap: 20px;
  padding: 20px 0;
  grid-template-columns: repeat(4, 1fr);

  @media screen and (max-width: 1400px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media screen and (max-width: 1050px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media screen and (max-width: 800px) {
    padding: 24px 0;
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
