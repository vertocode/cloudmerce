<template>
  <VeeForm
    id="form-element"
    @submit="handleSubmit"
  >
    <h2 class="title">
      Dados de Pagamento
    </h2>

    <p class="mb-5">
      Não se preocupe, seus dados estão seguros! Utilizamos a tecnologia da <a
        href="https://docs.stripe.com/security?locale=pt-BR"
        target="_blank"
      >Stripe</a> para processar os pagamentos, garantindo a máxima segurança das suas informações. Nenhum dado fornecido aqui será armazenado em nosso sistema.
    </p>

    <div
      v-if="!isFormLoaded"
      class="spinner"
    >
      <VProgressCircular
        indeterminate
        size="100"
      />
    </div>

    <div id="link-authentication-element" />
    <div id="payment-element" />

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
        :loading="isLoading"
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
import type { Stripe } from '@stripe/stripe-js'
import type { StripeElements } from '@stripe/stripe-js/types/stripe-js/elements-group'

defineProps<{ prev: () => void }>()

const { post } = useApi()
const { loadStripe } = useClientStripe()
const { ecommerceId } = useStoreData()
const { cartId, removeCartId } = useCart()
const { userData } = useUser()
const config = useRuntimeConfig()
const router = useRouter()

const isLoading = ref(false)
const isFormLoaded = ref(false)
const messages = ref<string[]>([])

let stripe: Stripe | null = null
let elements: StripeElements | null = null

onMounted(async () => {
  const { key: publishableKey } = config.public.stripe || {}
  if (!publishableKey) {
    throw new Error('Stripe publishable key not found')
  }
  stripe = await loadStripe(publishableKey) as Stripe | null

  const { clientSecret, error: backendError, id } = await $fetch('/api/create-payment-intent')

  if (!id) throw new Error('no id')
  if (!clientSecret) throw new Error('no client')

  if (backendError) {
    messages.value.push(backendError as string)
  }
  messages.value.push('Client secret returned.')

  if (!stripe) throw new Error('Stripe not loaded')

  elements = stripe.elements({ clientSecret })
  const paymentElement = elements.create('payment')
  paymentElement.mount('#payment-element')
  const linkAuthenticationElement = elements.create('linkAuthentication')
  linkAuthenticationElement.mount('#link-authentication-element')
  isLoading.value = false
  isFormLoaded.value = true
})

const handleSubmit = async () => {
  try {
    if (isLoading.value || !stripe || !elements) {
      return
    }

    isLoading.value = true

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
      },
      redirect: 'if_required',
    })

    if (error || !paymentIntent) {
      console.error('Error confirming payment:', error)
      handleError('Ocorreu um erro ao validar o pagamento, verifique os dados e tente novamente.')
      isLoading.value = false
      return
    }

    const response = await post(`/order/${ecommerceId}`, {
      cartId: cartId.value,
      userId: userData.value?._id,
      paymentIntentId: paymentIntent.id,
    }) as { code: 'success' | 'error', order: { _id: string } }

    if (response?.code === 'success') {
      removeCartId()
      handleSuccess('Pedido realizado com sucesso!')
      const { _id: orderId } = response?.order || {}
      if (orderId) {
        await router.push(`/orders/${orderId}`)
      }
      else {
        handleError('Ocorreu um erro ao redirecionar para a página de pedido. Verifique na lista de pedidos.')
        await router.push('/orders')
      }
    }
    else {
      throw new Error('code not success')
    }
  }
  catch (error) {
    console.error('Error processing payment:', error)
    handleError('Ocorreu um erro inesperado, atualize a pagina e tente novamente.')
  }
  finally {
    isLoading.value = false
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
