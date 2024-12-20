<template>
  <VCard
    class="product-card"
    elevation="0"
    @click.prevent="$router.push(`/product/${product.id}`)"
  >
    <div>
      <div class="product-image-container">
        <ProductImage
          :image="product.image"
        />
      </div>

      <div class="product-name-container">
        <VCardTitle class="product-name">
          {{ product.name }}
        </VCardTitle>
      </div>

      <VCardText class="product-description">
        {{ product.description }}
      </VCardText>
    </div>

    <div>
      <VCardSubtitle class="product-price">
        {{ formattedPrice }}
      </VCardSubtitle>
      <VCardActions class="card-actions">
        <div class="public-actions">
          <VBtn
            variant="flat"
            :loading="addingToCart"
            class="add-to-cart-btn"
            @click.stop="addToCart"
          >
            Comprar
          </VBtn>
        </div>

        <VBtn
          v-if="isAdmin"
          class="edit-btn"
          @click.stop="$router.push(`/product/${product.id}/edit`)"
        >
          Editar (ADM)
        </VBtn>
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
    </div>
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
    status: 'active',
    quantity: 1,
  })
}
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@200..700&display=swap');

.product-card {
  padding: 12px;
  color: #333;
  border-radius: 14px;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  background: #fff;
  overflow: hidden;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .product-image-container {
    overflow: hidden;
    border-radius: 16px;
    background-color: #E6E8EF;
    max-height: 350px;
    display: flex;
    align-items: center;

    :deep(.v-img) {
      margin: auto;
      max-width: 300px;
    }
  }

  .product-name-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: bold;
    color: #111;

    .product-name {
      padding: 0;
      margin-top: 12px;
      font-family: "Oswald", serif;
      font-optical-sizing: auto;
      font-weight: 500;
      font-style: normal;
      font-size: 1.2rem;

      @media screen and (max-width: $mobile-breakpoint) {
        font-size: 1rem;
      }
    }
  }

  .product-description {
    padding: 0;
    max-height: 100px;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
    word-wrap: break-word;
  }

  .product-price {
    margin-top: 4px;
    font-family: "Oswald", serif;
    font-optical-sizing: auto;
    font-weight: 500;
    padding: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 1.1rem;

    .detail-button {
      cursor: pointer;
    }

    @media screen and (max-width: $mobile-breakpoint) {
      font-size: .9rem;
    }
  }

  .card-actions {
    padding: 16px 0 0 0;
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
        transition: color 0.5s ease;
        height: 48px;
        border: 1px solid var(--primary-color-500);
        color: var(--primary-color-500);
        border-radius: 16px;
        width: 100%;
      }
    }

    .edit-btn {
      width: 100%;
      border-radius: 16px;
      border: 1px solid #28a745;
      color: #28a745;

      &:hover {
        border-color: #28a745;
      }
    }

    .delete-btn {
      width: 100%;
      border-radius: 16px;
      background-color: #dc3545;
      color: #fff;

      &:hover {
        background-color: #c82333;
      }
    }
  }

  &:hover {
    border: 2px solid var(--secondary-color-500);

    .add-to-cart-btn {
      border: none !important;
      color: white !important;
      background: linear-gradient(86.28deg, var(--secondary-color-700) 10.21%, var(--secondary-color-500) 42.99%, var(--secondary-color-500) 56.02%, var(--primary-color-700) 127.2%);
    }
  }

  @media screen and (max-width: $mobile-breakpoint) {
    .add-to-cart-btn {
      border: none !important;
      color: white !important;
      background: linear-gradient(86.28deg, var(--secondary-color-700) 10.21%, var(--secondary-color-500) 42.99%, var(--secondary-color-500) 56.02%, var(--primary-color-700) 127.2%);
    }
  }
}
</style>
