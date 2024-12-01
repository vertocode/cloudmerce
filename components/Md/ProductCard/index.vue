<template>
  <VCard class="product-card">
    <ProductImage :image="product.image" />

    <div class="product-name-container">
      <VCardTitle class="product-name">
        {{ product.name }}
      </VCardTitle>
    </div>

    <VCardSubtitle class="product-price">
      {{ formattedPrice }}
    </VCardSubtitle>

    <VCardActions class="card-actions">
      <VBtn
        color="primary"
        variant="flat"
        :loading="addingToCart"
        class="add-to-cart-btn"
        @click="addToCart"
      >
        Adicionar ao Carrinho
      </VBtn>
      <VBtn
        class="view-details-btn"
        variant="outlined"
        @click="$router.push(`/product/${product.id}`)"
      >
        Ver Detalhes
      </VBtn>
      <MdEditProductModal
        :initial-values="product"
        :updateProductList
      >
        <VBtn
          v-if="isAdmin"
          class="edit-btn"
        >
          Editar (ADM)
        </VBtn>
      </MdEditProductModal>
      <MdDeleteProductModal
        :on-confirm="() => handleDelete(product)"
        :product-name="product.name"
      >
        <VBtn
          v-if="isAdmin"
          class="delete-btn"
        >
          Deletar (ADM)
        </VBtn>
      </MdDeleteProductModal>
    </VCardActions>
  </VCard>
  <MdAddItemQuestionModal
    :product="showQuestionAddModal ? product : null"
    @close="showQuestionAddModal = false"
  />
</template>

<script setup lang="ts">
import { computed, defineProps } from 'vue'
import type { IProduct } from '~/types/product'
import ProductImage from '~/components/Md/ProductImage/index.vue'

const props = defineProps<{
  product: IProduct
  updateProductList: (param: { cache: 'no-cache' | 'force-cache' }) => Promise<void>
}>()

const { handleDelete } = useProduct({ updateProductList: props.updateProductList })

const { isAdmin } = useUser()
const { addToCart: handleAddToCart, loading: addingToCart } = useCart()

const showQuestionAddModal = ref<boolean>(false)

const formattedPrice = computed(() => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(props.product.price)
})

const addToCart = async () => {
  if (props.product.fields.length > 0) {
    showQuestionAddModal.value = true
    return
  }

  await handleAddToCart({
    ...props.product,
    quantity: 1,
  })
}
</script>

<style lang="scss" scoped>
.product-card {
  color: #333;
  border-radius: 14px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  background: #fff;
  overflow: hidden;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  }

  .product-name-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 0;
    font-weight: bold;
    color: #111;

    .product-name {
      font-size: 1.5rem;
      color: #007aff;
    }
  }

  .product-price {
    color: #6c757d;
    font-size: 1.1rem;
    padding: 0 16px 16px;
  }

  .card-actions {
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;

    .add-to-cart-btn,
    .view-details-btn,
    .edit-btn,
    .delete-btn {
      width: 100%;
      padding: 12px;
      transition: background-color 0.3s, transform 0.3s;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

      &:hover {
        transform: translateY(-2px);
      }
    }

    .add-to-cart-btn {
      background-color: #007aff;
      color: #fff;

      &:hover {
        background-color: #005bb5;
      }
    }

    .view-details-btn {
      background-color: #f4f4f4;
      color: #007aff;

      &:hover {
        background-color: #e0e0e0;
      }
    }

    .edit-btn {
      background-color: #28a745;
      color: #fff;

      &:hover {
        background-color: #218838;
      }
    }

    .delete-btn {
      background-color: #dc3545;
      color: #fff;

      &:hover {
        background-color: #c82333;
      }
    }
  }
}
</style>
