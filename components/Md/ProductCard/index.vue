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
      <VIcon
        class="detail-button"
        size="42"
        @click="$router.push(`/product/${product.id}`)"
      >
        mdi-eye-circle
      </VIcon>
    </VCardSubtitle>

    <VCardActions class="card-actions">
      <div class="public-actions">
        <VBtn
          color="primary"
          variant="flat"
          :loading="addingToCart"
          class="add-to-cart-btn"
          @click="addToCart"
        >
          Comprar
        </VBtn>
      </div>

      <MdEditProductModal
        :initial-values="product"
        :update-product-list
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

      @media screen and (max-width: $mobile-breakpoint) {
        font-size: 1rem;
      }
    }
  }

  .product-price {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #6c757d;
    font-size: 1.1rem;
    padding: 0 16px 16px;

    .detail-button {
      cursor: pointer;
    }

    @media screen and (max-width: $mobile-breakpoint) {
      font-size: .9rem;
    }
  }

  .card-actions {
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;

    .public-actions {
      width: 100%;
      display: flex;
      gap: 16px;
      align-items: center;
      justify-content: flex-end;

      .add-to-cart-btn {
        width: 100%;
      }
    }

    .edit-btn {
      width: 100%;
      background-color: #28a745;
      color: #fff;

      &:hover {
        background-color: #218838;
      }
    }

    .delete-btn {
      width: 100%;
      background-color: #dc3545;
      color: #fff;

      &:hover {
        background-color: #c82333;
      }
    }
  }
}
</style>
