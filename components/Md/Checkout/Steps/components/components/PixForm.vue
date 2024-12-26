<template>
  <VeeForm @submit="handleSubmit">
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
          Gerar Pix
        </span>
        <VIcon color="#fff">
          mdi-qrcode
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
    paymentMethod: PaymentMethods.Pix,
    ...values,
  })
}
</script>

<style lang="scss">
.action-buttons {
  margin-top: 32px;
}
</style>
