<template>
  <div class="product-detail-page">
    <header class="product-header">
      <VBtn
        prepend-icon="mdi-arrow-left"
        variant="outlined"
        @click="$router.back()"
      >
        Voltar
      </VBtn>
    </header>

    <div class="product-main">
      <div class="image-section">
        <MdProductImage :image="product.image" />
      </div>

      <div class="details-section">
        <h1 class="product-name">
          {{ product.name }}
        </h1>
        <p class="product-id">
          #{{ product.id }}
        </p>
        <p class="product-price">
          {{ formattedPrice }}
        </p>
        <p class="product-description">
          {{ product.description }}
        </p>

        <ul
          v-if="product.fields.length"
          class="product-fields"
        >
          <li
            v-for="(field, index) in product.fields.filter(field => field.type === 'options')"
            :key="index"
            class="field-item"
          >
            <span class="field-label">{{ field.label }}:</span>
            <span class="field-value">{{ field.options?.join(', ') }}</span>
          </li>
        </ul>

        <div class="action-buttons">
          <VBtn
            class="w-full"
            :loading="loading"
            color="primary"
            block
            @click="addToCart"
          >
            <VIcon
              class="mr-1"
              color="#fff"
            >
              mdi-cart
            </VIcon>
            Adicionar ao Carrinho
          </VBtn>
        </div>
      </div>
    </div>

    <MdAddItemQuestionModal
      :product="showQuestionAddModal ? product : null"
      @close="showQuestionAddModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import type { IProduct } from '~/types/product'

const showQuestionAddModal = ref(false)

const props = defineProps<{ product: IProduct }>()

const { addToCart: handleAddToCart, loading } = useCart()

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

<style scoped lang="scss">
.product-detail-page {
  display: flex;
  flex-direction: column;
  padding: 16px;

  .product-header {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
  }

  .product-main {
    display: flex;
    gap: 24px;
    align-items: center;

    .image-section {
      width: 100%;
      max-width: 400px;
      align-self: baseline;

      :deep(.product-image-carousel) {
        width: 100%;
      }
    }

    @media (max-width: $mobile-breakpoint) {
      flex-wrap: wrap;

      .image-section {
        max-width: 100%;
      }
    }

    .details-section {
      height: max-content;
      display: flex;
      flex-direction: column;
      width: 100%;

      .product-name {
        font-size: 1.5rem;
        font-weight: bold;
        margin-bottom: 0;
        padding-bottom: 0;
        color: #333;
      }

      .product-id {
        font-size: .9rem;
        margin-bottom: 8px;
        color: gray;
      }

      .product-price {
        font-size: 1.25rem;
        font-weight: bold;
        color: #27ae60;
        margin-bottom: 16px;
      }

      .product-description {
        font-size: 1rem;
        color: #616161;
        line-height: 1.5;
        margin-bottom: 16px;
      }

      .product-fields {
        list-style: none;
        padding: 0;
        margin-bottom: 16px;

        .field-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;

          .field-label {
            font-weight: bold;
            color: #424242;
          }

          .field-value {
            color: #616161;
          }
        }
      }

      .action-buttons {
        margin-top: auto;
        max-width: 400px;

        @media (max-width: $mobile-breakpoint) {
          max-width: 100%;
        }

        .v-btn {
          width: 100%;
          padding: 12px;
          font-size: 1rem;
          font-weight: bold;
          text-transform: uppercase;
        }
      }
    }
  }
}
</style>
