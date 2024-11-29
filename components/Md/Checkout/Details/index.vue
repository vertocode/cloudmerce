<template>
  <div>
    <VCard elevation="1" class="checkout-details">
      <MdCalcProductSummary :cartProducts :total />
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
              <MdCartItem
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
