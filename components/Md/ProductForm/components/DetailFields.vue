<template>
  <Card>
    <h3>Detalhes do produto</h3>
    <VRow>
      <VCol
        cols="12"
        md="4"
      >
        <VeeTextField
          name="productName"
          label="Nome do Produto"
          variant="outlined"
        />
      </VCol>

      <VCol
        cols="12"
        md="4"
      >
        <VeeTextField
          name="productPrice"
          label="Preço do Produto"
          variant="outlined"
          type="number"
          prefix="R$"
        />
      </VCol>

      <VCol
        cols="12"
        md="4"
        class="product-type-container"
      >
        <VeeSelect
          name="productType"
          :items="productTypes.map(type => type.name)"
          placeholder="Selecione o tipo de produto"
          label="Tipo de Produto"
          variant="outlined"
          no-data-text="Sem opções, clique para cadastrar um novo tipo de produto abaixo deste input."
        />
        <span
          v-if="onRegisterNewProductType"
          class="product-type-message"
          @click="onRegisterNewProductType"
        >
          Cadastrar novo tipo de produto <VIcon color="var(--secondary-700)">mdi-link</VIcon>
        </span>
      </VCol>

      <VCol
        cols="12"
        md="12"
      >
        <VeeTextarea
          name="productDescription"
          label="Descrição do Produto"
          variant="outlined"
          rows="4"
        />
      </VCol>
    </VRow>
  </Card>
</template>

<script setup lang="ts">
import type { IProductType } from '~/composables/useProductTypes'
import Card from '~/components/Md/ProductForm/components/Card.vue'

defineProps<{
  productTypes: IProductType[]
  onRegisterNewProductType?: () => void
}>()
</script>

<style lang="scss" scoped>
.product-type-container {
  position: relative;

  .product-type-message {
    cursor: pointer;
    position: absolute;
    top: 75px;
    right: 8px;
    color: var(--secondary-color-700);
    font-size: .9rem;
  }
}
</style>
