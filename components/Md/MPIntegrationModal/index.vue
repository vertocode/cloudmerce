<template>
  <ElModal
    :is-opened="isOpened"
    persistent
    hide-close
    :card-props="{
      title: 'Vincular conta do mercado pago',
      prependIcon: 'mdi-cart',
    }"
    max-width="400"
  >
    <div class="mp-integration-modal">
      <p>Você precisa vincular sua conta do Mercado Pago à aplicação para receber os pagamentos. Clique no botão abaixo para fazer isso.</p>
      <VBtn
        class="mp-btn"
        @click="redirect"
      >
        <img
          src="https://logospng.org/download/mercado-pago/logo-mercado-pago-icone-1024.png"
          alt="Mercado Pago logo"
          class="mp-logo"
        >
        Vincular Conta
      </VBtn>
    </div>
  </ElModal>
</template>

<script setup lang="ts">
const isOpened = ref(false)

const { userData } = useUser()
const route = useRoute()
const { whitelabel, hasWhitelabel } = useWhitelabel()

if (hasWhitelabel.value && route.path !== '/mp-oauth-confirmation') {
  isOpened.value = !whitelabel.value?.hasMP
}

const redirect = () => {
  const platformId = 'mp'
  const clientId = '5581626523211176'
  const state = userData.value?._id || 'unlogged'
  const redirectUri = window.location.origin + '/mp-oauth-confirmation'
  const responseType = 'code'
  window.open(`https://auth.mercadopago.com.br/authorization?client_id=${clientId}&response_type=${responseType}&state=${state}&platform_id=${platformId}&redirect_uri=${redirectUri}`, '_self')
}
</script>

<style scoped>
.mp-integration-modal {
  text-align: center;
}

.mp-btn {
  margin: 16px auto auto;
  display: flex;
  align-items: center;
  background-color: #00BCFF;
  color: white;
  font-weight: 600;
  border-radius: 8px;
}

.mp-logo {
  width: 36px;
  height: 36px;
  margin-right: 10px;
}

.mp-btn .v-btn__content {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
