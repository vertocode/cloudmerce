<template>
  <VeeForm
    id="form-element"
    @submit="handleSubmit"
  >
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
defineProps<{ prev: () => void }>()

const { post } = useApi()
const { cartId, removeCartId, total } = useCart()
const { userData } = useUser()
const router = useRouter()

const isLoading = ref(false)
const isFormLoaded = ref(false)

const handleSubmit = async () => {
  try {
    if (isLoading.value) {
      return
    }

    const { getWhitelabel } = useWhitelabel()

    const whitelabel = await getWhitelabel()

    isLoading.value = true

    const { name: userName, email: userEmail } = userData.value || {}

    const response = await post(`/order/${whitelabel?._id}`, {
      cartId: cartId.value,
      userId: userData.value?._id,
      paymentData: {
        description: `Compra para ${userName} na loja ${whitelabel?.name}`,
        paymentMethod: 'pix',
        totalAmount: total.value,
        payer: {
          email: userEmail,
        },
      },
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
.action-buttons {
  margin-top: 16px;
}
</style>
