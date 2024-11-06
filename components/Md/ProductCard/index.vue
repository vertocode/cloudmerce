<template>
  <VCard class="product-card">
    <ProductImage :product />

    <div class="product-name-container">
      <VCardTitle class="product-name">{{ product.name }}</VCardTitle>

<!--      <VTooltip v-if="product.description" :text="product.description">-->
<!--        <template v-slot:activator="{ props }">-->
<!--          <VBtn class="info-button" v-bind="props" icon>-->
<!--            <VIcon>mdi-information</VIcon>-->
<!--          </VBtn>-->
<!--        </template>-->
<!--      </VTooltip>-->
    </div>

    <VCardSubtitle class="product-price">{{ formattedPrice }}</VCardSubtitle>

    <VCardActions class="card-actions">
      <VBtn color="primary" variant="flat" @click="addToCart" class="add-to-cart-btn">Adicionar ao Carrinho</VBtn>
      <MdProductDetailModal :product>
        <VBtn class="view-details-btn" variant="outlined">Ver Detalhes</VBtn>
      </MdProductDetailModal>
      <MdEditProductModal :initial-values="product" :updateProductList>
        <VBtn v-if="isAdmin" class="edit-btn">Editar (ADM)</VBtn>
      </MdEditProductModal>
      <MdDeleteProductModal :on-confirm="handleDelete" :product-name="product.name">
        <VBtn v-if="isAdmin" class="delete-btn">Deletar (ADM)</VBtn>
      </MdDeleteProductModal>
    </VCardActions>
  </VCard>
  <MdAddItemQuestionModal :product="showQuestionAddModal ? product : null" @close="showQuestionAddModal = false"/>
</template>

<script setup lang="ts">
import { computed, defineProps } from 'vue';
import type { IProduct } from "~/types/product";
import ProductImage from "~/components/Md/ProductImage/index.vue";

const props = defineProps<{
  product: IProduct
  updateProductList: (param: { cache: 'no-cache' | 'force-cache' }) => Promise<void>
}>();

const { handleDelete } = useProduct({ product: props.product, updateProductList: props.updateProductList });

const { isAdmin } = useUser()

const showQuestionAddModal = ref<boolean>(false)

const formattedPrice = computed(() => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(props.product.price);
});

const addToCart = () => {
  if (props.product.fields.length > 0) {
    showQuestionAddModal.value = true
    return
  }

  window.alert(`Produto ${props.product.name} adicionado ao carrinho!`);
  // TODO: Add product to cart without opening modal
}
</script>

<style lang="scss" scoped>
.product-card {
  background-color: #f5f5f5;
  color: #424242;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }

  .product-image-carousel {
    height: max-content !important;
    max-width: 100%;
    border-radius: 8px;
  }

  .product-image {
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    mix-blend-mode: darken;
  }

  .product-name-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;

    .product-name {
      font-weight: bold;
      color: #333333;
    }

    .info-button {
      margin-top: 8px;
      margin-right: 8px;
    }
  }

  .product-price {
    color: #616161;
    font-size: 1.1rem;
    margin-bottom: 10px;
  }

  .card-actions {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 16px;

    .view-details-btn, .add-to-cart-btn {
      width: 100%;
    }

    .edit-btn {
      width: 100%;
      color: var(--primary-color-500);
      background-color: var(--secondary-color-500) !important;

      &:hover {
        background-color: var(--secondary-color-700) !important;
      }
    }

    .delete-btn {
      width: 100%;
      color: #fff;
      background-color: var(--danger-color-500) !important;

      &:hover {
        background-color: var(--danger-color-700) !important;
      }
    }
  }
}
</style>
