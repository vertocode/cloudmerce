<template>
  <div>
    <VCard elevation="1" class="checkout-details">
      <div class="summary">
        <h4>Calculo dos Produtos</h4>
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
    <VCard elevation="1" class="checkout-products">
      <div class="list">
        <VExpansionPanels elevation="0" v-model="expandedPanels">
          <VExpansionPanel>
            <VExpansionPanelTitle>
              <h4 class="product-title">
                Produtos no Carrinho ({{ cartProducts.length }})
              </h4>
            </VExpansionPanelTitle>
            <VExpansionPanelText>
              <CartItem
                  class="item"
                  v-for="(item, index) in cartProducts"
                  :key="index"
                  :item="item"
              />
            </VExpansionPanelText>
          </VExpansionPanel>
        </VExpansionPanels>
      </div>
    </VCard>
  </div>
</template>

<script setup lang="ts">
import CartItem from "~/components/Md/Header/CartItem.vue";

const { cartProducts, total } = useCart()

const expandedPanels = ref<number[]>([0])
</script>

<style lang="scss" scoped>
.checkout-details {
  height: max-content;
  margin: 16px 0;
  padding: 16px;

  h3 {
    font-size: 1.5rem;
    margin-bottom: 16px;
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

.checkout-products {
  margin-bottom: 16px;

  .list {
    .item:not(:first-child) {
      border-top: 1px solid #e0e0e0;
      padding-top: 16px;
    }

    .product-title {
      font-weight: 500;
      font-size: 1rem !important;
    }
  }
}
</style>
