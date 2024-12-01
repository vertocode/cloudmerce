<template>
  <VListItem class="product-item">
    <img
      :src="item.productId.image?.[0] || '/placeholder.png'"
      alt="Imagem do produto"
      class="product-image"
    >
    <div class="product-info">
      <VTooltip bottom>
        <template #activator="{ props }">
          <VListItemTitle v-bind="props">
            {{ item.productId.name }}
          </VListItemTitle>
        </template>
        <div>
          {{ item.productId.name }}
        </div>
      </VTooltip>
      <VListItemSubtitle>Qtd: {{ item.quantity }}</VListItemSubtitle>
    </div>
    <div class="product-price">
      <span>R$ {{ (item.productId.price * item.quantity).toFixed(2) }}</span>
    </div>
  </VListItem>
</template>

<script setup lang="ts">
import type { OrderItem } from '~/types/order'

interface Props {
  item: OrderItem
}
defineProps<Props>()
</script>

<style lang="scss" scoped>
.product-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;

  img {
    margin-right: 12px;
    width: 48px;
    height: 48px;
    object-fit: contain;
  }

  .product-info {
    max-width: 100px;
    flex-grow: 1;
  }

  .product-price {
    font-size: .8rem;
    font-weight: 700;
  }
}
</style>
