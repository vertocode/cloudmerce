<template>
  <div class="calc-product-summary">
    <h4>Calculo dos Produtos</h4>
    <div
      v-for="cartProduct in cartProducts"
      :key="`calc-product-${cartProduct.id}`"
      class="row-summary"
    >
      <VTooltip bottom>
        <template #activator="{ props }">
          <div
            class="label"
            v-bind="props"
          >
            <span>{{ cartProduct.quantity }} {{ cartProduct.name }}</span>
          </div>
        </template>
        <div>
          <span>{{ cartProduct.quantity }} {{ cartProduct.name }}</span>
        </div>
      </VTooltip>
      <span class="value">+ R${{ cartProduct.price * cartProduct.quantity }}</span>
    </div>

    <div class="cart-total">
      <span>Total:</span>
      <span class="cart-total-value">R${{ total }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ICartItem } from '~/types/cart'

interface Props {
  cartProducts: ICartItem[]
  total: string
}

defineProps<Props>()
</script>

<style lang="scss" scoped>
.calc-product-summary {
  .row-summary {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 16px 0;

    .label {
      max-width: 220px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .value {
      font-weight: 600;
    }
  }

  .cart-total {
    border-top: 1px solid #e0e0e0;
    padding-top: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 16px 0;
    font-weight: bold;
    font-size: 1.2rem;
    color: #212121;

    .cart-total-value {
      color: var(--primary-color);
    }
  }
}
</style>
