<template>
  <VeeForm
    @submit="handleSubmit"
  >
    <section class="rows">
      <h3>Dados do Cartão</h3>
      <div class="row-1">
        <VeeTextField
          name="cardHolderName"
          label="Títular do Cartão"
        />

        <VeeTextField
          name="cardCpf"
          label="CPF do Títular do Cartão"
        />
      </div>

      <div class="row-2">
        <VeeTextField
          name="cardNumber"
          label="Número do Cartão"
        />

        <VeeMaskedField
          name="cardExpiryDate"
          mask="##/####"
          placeholder="MM/AAAA"
          label="Data de Expiração"
        />

        <VeeTextField
          name="cardCvv"
          label="CCV"
        />
      </div>
    </section>

    <div class="action-buttons">
      <VBtn
        class="back-button"
        prepend-icon="mdi-arrow-left"
        @click="prev"
      >
        Voltar
      </VBtn>
      <VeeButton
        class="next-button"
        color="primary"
        :loading="loadingSubmit"
      >
        <span class="mr-2">
          Processar Pagamento
        </span>
        <VIcon color="#fff">
          mdi-credit-card-outline
        </VIcon>
      </VeeButton>
    </div>
  </VeeForm>
</template>

<script setup lang="ts">
import { type CreditCardData, PaymentMethods } from '~/types/cart'

defineProps<{ prev: () => void }>()

const { submit, loadingSubmit } = useCart()

const handleSubmit = async (values: CreditCardData) => {
  await submit({
    paymentMethod: PaymentMethods.CreditCard,
    creditCardData: values,
  })
}
</script>

<style lang="scss">
.rows {
  margin-top: 16px;

  .row-1, .row-2 {
    display: grid;
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .row-1 {
    margin-top: 12px;
    grid-template-columns: repeat(2, 1fr);
  }

  .row-2 {
    grid-template-columns: 1fr .5fr .48fr;
  }
}
</style>
