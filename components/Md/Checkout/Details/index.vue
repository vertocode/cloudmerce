<template>
  <VCard elevation="3" class="checkout-details">
    <h3>Detalhes da Compra</h3>
    <div class="list">
      <VList>
        <CartItem v-for="(item, index) in cartProducts" :key="index" :item="item" />
      </VList>
    </div>
    <div class="summary">
      <div class="row-summary" v-for="cartProduct in cartProducts">
        <VTooltip bottom>
          <template #activator="{ props }">
            <div class="label" v-bind="props">
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
  </VCard>
</template>

<script setup lang="ts">
import CartItem from "~/components/Md/Header/CartItem.vue";

const { cartProducts, total } = useCart()
</script>

<style lang="scss">
.checkout-details {
  height: max-content;
  margin: 16px 0;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 0.9);

  h3 {
    font-size: 1.5rem;
    margin-bottom: 16px;
  }

  .list {
    max-height: 700px;
    overflow-y: auto;
    margin-bottom: 16px;
    border-bottom: 1px solid #e0e0e0;
  }

  .summary {
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
}
</style>
