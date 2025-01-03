<template>
  <main class="payment-link">
    <div class="content">
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
        @click="redirectToHome"
      >
        Voltar para o Início
      </v-btn>
      <v-btn
        @click="test"
      >
        Vincular!
      </v-btn>
    </div>
  </main>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const redirectToHome = () => {
  router.push('/')
}

const test = () => {
  const platformId = '5410072078369167'
  const clientId = '213050737'
  const redirectUri = 'https://cloudmerce.vertocode.com' + '/mp-oauth-confirmation'
  const responseType = 'code'
  window.open(`https://auth.mercadopago.com.br/authorization?client_id=${clientId}&response_type=${responseType}&platform_id=${platformId}&redirect_uri=${redirectUri}`, '_blank')
}
</script>

<style scoped>
.payment-link {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
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
