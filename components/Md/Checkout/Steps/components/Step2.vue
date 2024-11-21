<template>
  <VeeForm @submit="handleSubmit" id="form-element">
    <h2 class="title">Dados de Pagamento</h2>

    <div id="link-authentication-element" />
    <div id="payment-element" />

    <div class="action-buttons">
      <VBtn @click="back" class="back-button" prepend-icon="mdi-arrow-left">
        Voltar
      </VBtn>
      <VeeButton class="next-button" color="primary" :loading="isLoading">
      <span class="mr-2">
        Processar Pagamento
      </span>
        <VIcon color="#fff">mdi-credit-card-outline</VIcon>
      </VeeButton>
    </div>
  </VeeForm>
</template>

<script setup lang="ts">
import type {Stripe} from "@stripe/stripe-js";
import type {StripeElements} from "@stripe/stripe-js/types/stripe-js/elements-group";

defineProps<{ back: Function }>()

const { loadStripe } = useClientStripe()
const config = useRuntimeConfig()

const isLoading = ref(false);
const messages = ref<string[]>([]);

let stripe: Stripe | null = null
let elements: StripeElements | null = null

onMounted(async () => {
  console.log(config, 'config')
  const { key: publishableKey } = config.public.stripe || {}
  console.log('publishableKey', publishableKey || 'nao tem key')
  if (!publishableKey) {
    throw new Error('Stripe publishable key not found')
  }
  stripe = await loadStripe(publishableKey) as Stripe | null

  const { clientSecret, error: backendError } = await fetch("/api/create-payment-intent").then((res) => res.json());

  if (backendError) {
    messages.value.push(backendError?.message as string)
  }
  messages.value.push('Client secret returned.')

  if (!stripe) throw new Error('Stripe not loaded')

  elements = stripe.elements({clientSecret});
  const paymentElement = elements.create('payment');
  paymentElement.mount("#payment-element");
  const linkAuthenticationElement = elements.create("linkAuthentication");
  linkAuthenticationElement.mount("#link-authentication-element");
  isLoading.value = false;
});

const handleSubmit = async () => {
  try {
    if (isLoading.value || !stripe || !elements) {
      return;
    }

    isLoading.value = true;

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/return`
      }
    });

    if (error.type === "card_error" || error.type === "validation_error") {
      handleError("Ocorreu um erro ao validar o cartão, verifique os dados e tente novamente.")
    } else {
      handleError("Ocorreu um erro inesperado, tente novamente mais tarde.")
    }

    isLoading.value = false

  } catch (error) {
    console.error('Error processing payment:', error)
    handleError("Ocorreu um erro inesperado, tente novamente mais tarde.")
  }
}
</script>

<style lang="scss">
.title {
  margin-bottom: 16px;
}

.action-buttons {
  margin-top: 16px;
}
</style>
