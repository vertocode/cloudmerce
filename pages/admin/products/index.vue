<template>
  <div class="admin-products">
    <div class="page-header">
      <h1>Produtos</h1>
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

    <VCard>
      <VCardText>
        <MdProductList
          :products="products"
          :update-product-list="update"
          :loading="loading"
          :current-page="currentPage"
          :total-pages="totalPages"
          :total-items="totalItems"
          @page-change="onChangePage"
        />
      </VCardText>
    </VCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['03-admin-auth'],
})

const { products, loading, update, currentPage, totalPages, totalItems, onChangePage } = useProductList()

onMounted(() => {
  update({ cache: 'no-cache' })
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

    @media (max-width: 600px) {
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;

      button {
        width: 100%;
      }
    }
  }
}
</style>
