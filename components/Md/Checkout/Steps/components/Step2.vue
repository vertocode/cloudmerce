<template>
  <VeeForm @submit="handleSubmit" id="card-element">
    <VRow>
      <VCol cols="12">
        <h2 class="title">Dados de Pagamento</h2>
      </VCol>
      <VCol cols="12" md="6" class="pl-0 pb-0">
        <VeeTextField required name="name" label="Nome no Cartão" />
      </VCol>
      <VCol cols="12" md="6" class="pl-0 pb-0">
        <VeeTextField required name="cpf" label="CPF do Titular do Cartão" />
      </VCol>
      <VCol cols="12" md="6" class="pl-0 pb-0">
        <VeeTextField required name="number" label="Número do Cartão" />
      </VCol>
      <VCol cols="12" md="4" class="pl-0 pb-0">
        <VeeTextField required name="expDate" label="Data de Expiração" />
      </VCol>
      <VCol cols="12" md="2" class="pl-0 pb-0">
        <VeeTextField required name="cvc" label="CVC" />
      </VCol>
    </VRow>
    <VBtn @click="back" class="back-button" prepend-icon="mdi-arrow-left">
      Voltar
    </VBtn>
    <VeeButton class="next-button" color="primary">
      <span class="mr-2">
        Processar Pagamento
      </span>
      <VIcon color="#fff">mdi-credit-card-outline</VIcon>
    </VeeButton>
  </VeeForm>
</template>

<script setup lang="ts">
defineProps<{ back: Function }>()

const { post } = useApi()
const { stripe } = useClientStripe()

watch(
    stripe,
    async () => {
      if (stripe.value) {
        // https://github.com/stripe-samples/accept-a-payment/blob/main/payment-element/client/vue-cva/src/components/SrCheckoutForm.vue
        const { clientSecret, error } = await $fetch(
            "/api/create-payment-intent"
        );
        console.log(clientSecret);
        console.log(error);
        if (error) {
          console.error(error);
          return;
        }

        const elements = stripe.value.elements({
          clientSecret: clientSecret as string,
        });
        const linkAuthenticationElement = elements.create("linkAuthentication");
        linkAuthenticationElement.mount("#linkAuthenticationElement");
      }
    },
    {
      immediate: true,
    }
)

const handleSubmit = async (values: any) => {
  const { number, cvc, expDate } = values || {}
  try {
    // const response = await post('/api/create-payment-intent', {
    //   cardNumber: number.value,
    //   expDate: expDate.value,
    //   cvc: cvc.value,
    // })

  } catch (error) {
    console.error('Error processing payment:', error)
  }
}
</script>

<style lang="scss">

</style>
