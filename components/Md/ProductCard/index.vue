<template>
  <VCard class="product-card">
    <VImg :src="product.image" :alt="product.name" aspect-ratio="1" class="product-image" />

    <VCardTitle class="product-name">{{ product.name }}</VCardTitle>

    <VCardSubtitle class="product-price">{{ formattedPrice }}</VCardSubtitle>

    <VCardActions class="card-actions">
      <VBtn color="primary" @click="addToCart" class="add-to-cart-btn">Adicionar ao Carrinho</VBtn>
      <VBtn @click="viewDetails" class="view-details-btn">Ver Detalhes</VBtn>
    </VCardActions>
  </VCard>
</template>

<script setup lang="ts">
import { computed, defineProps } from 'vue';

const props = defineProps({
  product: {
    type: Object,
    required: true,
  }
})

const formattedPrice = computed(() => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(props.product.price);
});

const addToCart = () => {
  alert(`Produto ${props.product.name} adicionado ao carrinho!`);
};

const viewDetails = () => {
  alert(`Detalhes do produto: ${props.product.name}`);
};
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

  .product-image {
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }

  .product-name {
    font-weight: bold;
    color: #333333;
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

    .add-to-cart-btn {
      width: 100%;
      background-color: var(--primary-color-500);
      color: #fff !important;

      &:hover {
        background-color: var(--primary-color-600);
      }
    }

    .view-details-btn {
      width: 100%;
    }
  }
}
</style>
