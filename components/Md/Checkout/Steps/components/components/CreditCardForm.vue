<template>
  <VeeForm @submit="handleSubmit">
    <div
      v-if="!isFormLoaded"
      class="spinner"
    >
      <VProgressCircular
        indeterminate
        size="100"
      />
    </div>

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
        disabled
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
import { PaymentMethods } from '~/types/cart'

defineProps<{ prev: () => void }>()

const { submit, loadingSubmit } = useCart()

const handleSubmit = async (values: Record<string, string>) => {
  await submit({
    paymentMethod: PaymentMethods.CreditCard,
    ...values,
  })
}

const isFormLoaded = ref(false)
</script>

<style lang="scss">
.action-buttons {
  margin-top: 16px;
}
</style>
