<template>
  <div class="step2">
    <h2 class="title">
      Dados de Pagamento
    </h2>

    <div class="payment-methods">
      <div
        v-for="option in Object.values(PaymentMethods)"
        :key="`payment-method-${option}`"
        class="option"
        :class="{ active: paymentMethod === option }"
        @click="paymentMethod = option"
      >
        {{ PaymentMethodLabels[option] }}
      </div>
    </div>

    <PixForm
      v-if="paymentMethod === PaymentMethods.Pix"
    />
    <CreditCardForm
      v-else-if="paymentMethod === PaymentMethods.CreditCard"
      :prev
    />
  </div>
</template>

<script setup lang="ts">
import CreditCardForm from '~/components/Md/Checkout/Steps/components/components/CreditCardForm.vue'
import PixForm from '~/components/Md/Checkout/Steps/components/components/PixForm.vue'

enum PaymentMethods {
  Pix = 'pix',
  CreditCard = 'credit_card',
}

enum PaymentMethodLabels {
  pix = 'Pix',
  credit_card = 'Cartão de Crédito',
}

defineProps<{ prev: () => void }>()
const paymentMethod = ref<PaymentMethods>(PaymentMethods.Pix)
</script>

<style lang="scss" scoped>
.step2 {
  .title {
    margin-bottom: 16px;
  }

  .payment-methods {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 12px;

    .option {
      cursor: pointer;
      border: 1px solid gray;
      padding: 12px;
      text-align: center;
      border-radius: 8px;
      width: 50%;
      font-size: larger;

      &.active {
        background-color: var(--primary-color-500);
        color: white;
      }
    }
  }
}
</style>
