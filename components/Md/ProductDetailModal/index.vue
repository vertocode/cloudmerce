<template>
  <Modal
      :is-opened="showProductDetailModal"
      :card-props="{ title: product.name }"
      max-width="550"
      @click:outside="onClose"
      @close="onClose"
  >
    <template #trigger>
      <div class="trigger-container" @click="showProductDetailModal = true">
        <slot />
      </div>
    </template>

    <div class="product-detail-modal">
      <MdProductImage :image="product.image" />

      <div class="product-info">
        <h2 class="product-price">{{ formattedPrice }}</h2>
        <p class="product-description">{{ product.description }}</p>

        <ul class="product-fields">
          <li
              v-for="(field, index) in product.fields.filter(field => field.type === 'options')"
              :key="index"
              class="field-item"
          >
            <span>{{ field.label }}:</span>
            <span>{{ field.options?.join(', ') }}</span>
          </li>
        </ul>
      </div>

      <v-btn
          :loading
          class="w-100"
          color="primary"
          @click="handleAddToCart"
      >
        Adicionar ao Carrinho
      </v-btn>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { computed, defineProps, ref } from 'vue'
import Modal from '~/components/El/Modal/index.vue'
import type { IProduct } from "~/types/product"

const showProductDetailModal = ref(false)

const onClose = () => {
  showProductDetailModal.value = false
}

const props = defineProps<{ product: IProduct }>()

const { addToCart, loading } = useCart()

const formattedPrice = computed(() => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(props.product.price)
})

const handleAddToCart = () => {
  addToCart({ ...props.product, quantity: 1 })
  onClose()
}

</script>

<style scoped lang="scss">
.trigger-container {
  width: 100%;
  cursor: pointer;
}

.product-detail-modal {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;

  .product-info {
    display: flex;
    flex-direction: column;
    gap: 12px;

    .product-price {
      font-size: 1.6rem;
      font-weight: bold;
      color: #333;
    }

    :deep(.product-image-carousel) {
      height: max-content !important;
    }

    .product-description {
      font-size: 1rem;
      color: #616161;
      line-height: 1.5;
    }

    .product-fields {
      list-style: none;
      padding: 0;
      margin-top: 8px;

      .field-item {
        display: flex;
        justify-content: space-between;
        font-size: 0.9rem;
        color: #424242;

        span {
          &:first-child {
            font-weight: bold;
          }
        }
      }
    }
  }
}
</style>
