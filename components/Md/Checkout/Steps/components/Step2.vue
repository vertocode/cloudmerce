<template>
  <div class="step2">
    <h2 class="title">
      Forma de pagamento
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
      :prev
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
import { PaymentMethods, PaymentMethodLabels } from '~/types/cart'

defineProps<{ prev: () => void }>()
const paymentMethod = ref<PaymentMethods>(PaymentMethods.Pix)
</script>

<style lang="scss" scoped>
.step2 {
  .title {
    margin-bottom: 16px;
    font-size: 1.2rem;
  }

  .payment-methods {
    display: flex;
    justify-content: space-between;
    align-items: center;
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
