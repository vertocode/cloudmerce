<template>
  <div class="financeiro-page">
    <div class="page-header">
      <h1 class="page-title">
        Configuração Financeira
      </h1>
      <p class="page-subtitle">
        Configure sua conta do Mercado Pago para receber pagamentos com split automático (95% para você, 5% para a plataforma)
      </p>
    </div>

    <VCard
      v-if="!hasConfiguredMP"
      class="info-card"
    >
      <VCardText>
        <div class="info-content">
          <VIcon
            size="64"
            color="warning"
            class="mb-4"
          >
            mdi-alert-circle-outline
          </VIcon>
          <h3 class="mb-3">
            Conta do Mercado Pago não configurada
          </h3>
          <p class="mb-4">
            Para receber pagamentos na sua loja, você precisa conectar sua conta do Mercado Pago.
            Com isso, você receberá automaticamente 95% do valor de cada venda, enquanto 5% ficam com a plataforma.
          </p>
          <VBtn
            color="success"
            size="large"
            :loading="loading"
            @click="startMPAuthorization"
          >
            <VIcon
              start
              size="20"
            >
              mdi-link-variant
            </VIcon>
            Conectar Mercado Pago
          </VBtn>
        </div>
      </VCardText>
    </VCard>

    <div v-else>
      <VCard class="mp-status-card">
        <VCardText>
          <div class="status-header">
            <div class="status-icon-wrapper">
              <VIcon
                size="48"
                color="success"
              >
                mdi-check-circle
              </VIcon>
            </div>
            <div class="status-info">
              <h3>Conta Mercado Pago Conectada</h3>
              <p>Sua conta está ativa e pronta para receber pagamentos</p>
            </div>
          </div>

          <VDivider class="my-6" />

          <div class="account-details">
            <div class="detail-row">
              <span class="detail-label">ID do Usuário:</span>
              <span class="detail-value">{{ whitelabel?.mp?.userId || '-' }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Public Key:</span>
              <span class="detail-value monospace">{{ maskKey(whitelabel?.mp?.publicKey) }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Split de Pagamentos:</span>
              <span class="detail-value">
                <VChip
                  color="success"
                  size="small"
                >
                  95% para você | 5% plataforma
                </VChip>
              </span>
            </div>
          </div>

          <VDivider class="my-6" />

          <div class="actions">
            <VBtn
              color="warning"
              variant="outlined"
              :loading="refreshing"
              @click="refreshToken"
            >
              <VIcon
                start
                size="20"
              >
                mdi-refresh
              </VIcon>
              Renovar Token
            </VBtn>
            <VBtn
              color="error"
              variant="outlined"
              @click="showDisconnectDialog = true"
            >
              <VIcon
                start
                size="20"
              >
                mdi-link-variant-off
              </VIcon>
              Desconectar Conta
            </VBtn>
          </div>
        </VCardText>
      </VCard>

      <VCard class="info-section mt-6">
        <VCardTitle>Como Funciona o Split de Pagamentos?</VCardTitle>
        <VCardText>
          <div class="info-list">
            <div class="info-item">
              <VIcon
                color="success"
                class="mr-3"
              >
                mdi-check-circle
              </VIcon>
              <div>
                <strong>Recebimento Automático:</strong>
                Você recebe 95% do valor de cada venda diretamente na sua conta do Mercado Pago
              </div>
            </div>
            <div class="info-item">
              <VIcon
                color="success"
                class="mr-3"
              >
                mdi-check-circle
              </VIcon>
              <div>
                <strong>Taxa da Plataforma:</strong>
                5% de cada venda fica com a plataforma para manutenção e melhorias
              </div>
            </div>
            <div class="info-item">
              <VIcon
                color="success"
                class="mr-3"
              >
                mdi-check-circle
              </VIcon>
              <div>
                <strong>Sem Taxas Extras:</strong>
                Você paga apenas as taxas do Mercado Pago, não cobramos nada adicional
              </div>
            </div>
            <div class="info-item">
              <VIcon
                color="success"
                class="mr-3"
              >
                mdi-check-circle
              </VIcon>
              <div>
                <strong>Tokens Válidos por 6 Meses:</strong>
                Renove seu token a cada 6 meses para manter sua conta ativa
              </div>
            </div>
          </div>
        </VCardText>
      </VCard>
    </div>

    <VDialog
      v-model="showDisconnectDialog"
      max-width="500"
    >
      <VCard>
        <VCardTitle>Desconectar Conta do Mercado Pago?</VCardTitle>
        <VCardText>
          <p class="mb-4">
            Tem certeza que deseja desconectar sua conta do Mercado Pago?
            Após a desconexão, você não poderá receber novos pagamentos até reconectar uma conta.
          </p>
          <VAlert
            type="warning"
            variant="tonal"
          >
            Esta ação não afeta pagamentos já processados.
          </VAlert>
        </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn
            variant="text"
            @click="showDisconnectDialog = false"
          >
            Cancelar
          </VBtn>
          <VBtn
            color="error"
            :loading="disconnecting"
            @click="disconnectAccount"
          >
            Desconectar
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['03-admin-auth'],
})

const config = useRuntimeConfig()
const { whitelabel, getWhitelabel } = useWhitelabel()
const { put } = useApi()

const loading = ref(false)
const refreshing = ref(false)
const disconnecting = ref(false)
const showDisconnectDialog = ref(false)

const hasConfiguredMP = computed(() => {
  // Check only for userId since accessToken is never sent to frontend for security
  return !!(whitelabel.value?.mp?.userId)
})

const maskKey = (key: string | undefined) => {
  if (!key) return '-'
  if (key.length <= 8) return key
  return `${key.substring(0, 8)}...${key.substring(key.length - 4)}`
}

const startMPAuthorization = () => {
  loading.value = true

  const clientId = config.public.mpClientId || '5581626523211176'
  const redirectUri = `${window.location.origin}/mp-oauth-confirmation`
  const state = whitelabel.value?._id || ''

  const authUrl = `https://auth.mercadopago.com.br/authorization?client_id=${clientId}&response_type=code&platform_id=mp&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`

  window.location.href = authUrl
}

const refreshToken = async () => {
  refreshing.value = true
  try {
    // Backend will fetch refreshToken from database (never sent to frontend for security)
    await put('/mp-refresh-token', {
      whitelabelId: whitelabel.value?._id,
    })

    await getWhitelabel({ cache: false })

    handleSuccess('Token renovado com sucesso!')
  } catch (error) {
    console.error('Error refreshing token:', error)
    handleError('Erro ao renovar token. Tente reconectar sua conta.')
  } finally {
    refreshing.value = false
  }
}

const disconnectAccount = async () => {
  disconnecting.value = true
  try {
    await put(`/whitelabel/${whitelabel.value?._id}`, {
      mp: {
        accessToken: null,
        refreshToken: null,
        userId: null,
        publicKey: null,
      },
    })

    await getWhitelabel({ cache: false })
    showDisconnectDialog.value = false

    handleSuccess('Conta do Mercado Pago desconectada com sucesso')
  } catch (error) {
    console.error('Error disconnecting account:', error)
    handleError('Erro ao desconectar conta')
  } finally {
    disconnecting.value = false
  }
}

onMounted(() => {
  // Reload whitelabel data to get the latest MP config
  getWhitelabel({ cache: false })
})
</script>

<style scoped lang="scss">
.financeiro-page {
  max-width: 900px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 32px;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1d1d1f;
  margin: 0 0 8px 0;
}

.page-subtitle {
  font-size: 1rem;
  color: #86868b;
  margin: 0;
  line-height: 1.5;
}

.info-card {
  .info-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 40px 20px;

    h3 {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1d1d1f;
    }

    p {
      font-size: 1rem;
      color: #86868b;
      max-width: 600px;
      line-height: 1.6;
    }
  }
}

.mp-status-card {
  .status-header {
    display: flex;
    align-items: center;
    gap: 20px;

    .status-icon-wrapper {
      flex-shrink: 0;
    }

    .status-info {
      h3 {
        font-size: 1.5rem;
        font-weight: 600;
        color: #1d1d1f;
        margin: 0 0 4px 0;
      }

      p {
        font-size: 1rem;
        color: #86868b;
        margin: 0;
      }
    }
  }

  .account-details {
    .detail-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;

      &:not(:last-child) {
        border-bottom: 1px solid #e5e5e7;
      }

      .detail-label {
        font-weight: 600;
        color: #86868b;
        font-size: 0.875rem;
      }

      .detail-value {
        color: #1d1d1f;
        font-size: 0.875rem;

        &.monospace {
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          background-color: #f5f5f7;
          padding: 4px 8px;
          border-radius: 4px;
        }
      }
    }
  }

  .actions {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
  }
}

.info-section {
  .info-list {
    display: flex;
    flex-direction: column;
    gap: 20px;

    .info-item {
      display: flex;
      align-items: flex-start;
      line-height: 1.6;

      strong {
        color: #1d1d1f;
      }
    }
  }
}
</style>
