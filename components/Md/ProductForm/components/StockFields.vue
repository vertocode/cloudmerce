<template>
  <VCol cols="12">
    <div class="stock-fields">
      <VeeRadioGroup
        class="stock-option-radios"
        name="stockOption"
        :options
        label="Estoque"
      />
      <VeeTextField
        v-if="showStockQuantity"
        name="stockQuantity"
        label="Número de unidades"
        variant="outlined"
        type="number"
        class="stock-quantity-field"
      />
    </div>
  </VCol>
</template>

<script setup lang="ts">
import { StockOptionLabels, StockOptions } from '~/components/Md/ProductForm/types/stock'

defineProps<{
  showStockQuantity?: boolean
}>()

const options = Object.entries(StockOptions).map(([key, value]) => ({
  value,
  label: StockOptionLabels[key as StockOptions],
}))
</script>

<style scoped lang="scss">
.stock-fields {
  background-color: #f5f5f5;
  padding: 12px;
  margin-top: 24px;
  display: flex;
  align-items: center;
  gap: 24px;

  @media (max-width: $mobile-breakpoint) {
    flex-direction: column;
    gap: 8px;
  }

  .stock-option-radios {
    width: 200px;
  }

  .stock-quantity-field {
    align-self: flex-end;
    height: max-content;
    width: 48px;
  }
}
</style>
