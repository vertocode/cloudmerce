<template>
  <main class="payment-link">
    <div
      v-if="isLoading"
      class="loading"
    >
      <h2 class="mb-5">
        Validando dados do mercado pago
      </h2>
      <VProgressCircular
        indeterminate
        size="100"
      />
    </div>
    <div
      v-else-if="success"
      class="content"
    >
      <h1>Conta do Mercado Pago está vinculada!</h1>
      <p class="description">
        Agora, os pagamentos realizados em seu E-Commerce serão diretamente creditados na conta do Mercado Pago que você acabou de vincular.
      </p>
      <div class="icon">
        <v-icon class="success-icon">
          mdi-check-circle-outline
        </v-icon>
      </div>
      <v-btn
        class="redirect-btn"
        color="primary"
        @click="redirectToFinanceiro"
      >
        Ir para Financeiro
      </v-btn>
    </div>
    <div v-else>
      <h1>Erro ao vincular sua conta do mercado pago a aplicacao, tente novamente mais tarde!</h1>
      <p>Se o problema persistir, entre em contato no formulario abaixo.</p>
      <VDivider class="my-4" />

      <ElContactForm />
    </div>
  </main>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

definePageMeta({
  middleware: ['03-admin-auth'],
})

const isLoading = ref<boolean>(true)
const success = ref<boolean>(false)

const router = useRouter()
const route = useRoute()
const { whitelabel, getWhitelabel } = useWhitelabel()
const { userData } = useUser()
const { post } = useApi()

const redirectToFinanceiro = () => {
  router.push('/admin/financeiro')
}

onMounted(async () => {
  try {
    const { code } = route.query || {}
    if (!code) {
      handleError('Código de autorização não encontrado')
    }
    await post('/mp-oauth-token', {
      whitelabelId: whitelabel.value?._id,
      state: userData.value?._id,
      authorizationCode: code,
      redirectUri: window.location.origin + '/mp-oauth-confirmation',
    })
    await getWhitelabel({ cache: false })
    success.value = true
  }
  catch (e) {
    handleError(e)
  }
  finally {
    isLoading.value = false
  }
})
</script>

<style scoped>
.payment-link {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.loading {
  text-align: center;
}

.content {
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0px 8px 15px var(--primary-color-100);
  text-align: center;
  color: var(--primary-color-500);
  max-width: 600px;
  width: 100%;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 20px;
  font-family: 'Roboto', sans-serif;
  font-weight: 600;
}

.description {
  font-size: 1.2rem;
  margin-bottom: 30px;
  line-height: 1.6;
}

.icon .success-icon {
  font-size: 60px;
  color: var(--secondary-color-500);
  margin-bottom: 20px;
}

.redirect-btn {
  margin-top: 20px;
}
</style>
