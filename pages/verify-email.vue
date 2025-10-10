<template>
  <div class="verify-email-page">
    <VCard class="verify-email-card" max-width="500">
      <VCardText>
        <div class="header">
          <VIcon size="64" color="primary">
            mdi-email-check-outline
          </VIcon>
          <h1>Verificar E-mail</h1>
          <p class="subtitle">
            Digite o código de 6 dígitos enviado para<br>
            <strong>{{ email }}</strong>
          </p>
        </div>

        <VForm v-if="!verified" @submit.prevent="handleSubmit" class="form">
          <VTextField
            v-model="verificationCode"
            label="Código de Verificação"
            variant="outlined"
            prepend-inner-icon="mdi-shield-check"
            maxlength="6"
            placeholder="000000"
            required
            :disabled="loading"
            class="mb-4 code-input"
            @input="formatCode"
          />

          <VBtn
            type="submit"
            color="primary"
            block
            size="large"
            :loading="loading"
            :disabled="verificationCode.length !== 6"
          >
            Verificar Código
          </VBtn>

          <div class="resend-container">
            <span>Não recebeu o código?</span>
            <VBtn
              variant="text"
              size="small"
              color="primary"
              @click="resendCode"
              :disabled="resending"
              :loading="resending"
            >
              Reenviar
            </VBtn>
          </div>

          <VBtn
            variant="text"
            block
            class="mt-4"
            @click="$router.push('/?login=true')"
          >
            Voltar para Login
          </VBtn>
        </VForm>

        <div v-else class="success-message">
          <VIcon size="80" color="success" class="mb-4">
            mdi-check-circle
          </VIcon>
          <h2>E-mail Verificado!</h2>
          <p>
            Sua conta foi verificada com sucesso.
          </p>
          <p class="small-text">
            Você já está autenticado e será redirecionado em instantes.
          </p>
        </div>
      </VCardText>
    </VCard>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const email = ref(route.query.email as string || '')
const verificationCode = ref('')
const loading = ref(false)
const resending = ref(false)
const verified = ref(false)

const { post } = useApi()
const { whitelabel } = useWhitelabel()
const { setUser } = useUser()

// Redirect to register if no email provided
onMounted(() => {
  if (!email.value) {
    handleWarning('Email não fornecido')
    router.push('/register')
  }
})

const formatCode = (event: Event) => {
  const input = event.target as HTMLInputElement
  // Only allow numbers
  verificationCode.value = input.value.replace(/\D/g, '')
}

const handleSubmit = async () => {
  if (!email.value || verificationCode.value.length !== 6) {
    handleWarning('Por favor, digite o código de 6 dígitos')
    return
  }

  if (!whitelabel.value?._id) {
    handleError('Erro ao identificar a loja')
    return
  }

  loading.value = true

  try {
    const response = await post('/auth/verify-email', {
      email: email.value,
      verificationCode: verificationCode.value,
      whitelabelId: whitelabel.value._id,
    }) as any

    if (response.errorCode === 'invalid_code') {
      handleError('Código de verificação inválido')
      loading.value = false
      return
    }

    if (response.errorCode === 'user_not_found') {
      handleError('Usuário não encontrado')
      loading.value = false
      return
    }

    if (response.code === 'success' || response.code === 'already_verified') {
      verified.value = true
      handleSuccess('E-mail verificado com sucesso!')

      // Set user data with the token
      if (response.user && response.token) {
        setUser({
          ...response.user,
          token: response.token,
        })
      }

      // Redirect to homepage after 2 seconds
      setTimeout(() => {
        router.push('/')
      }, 2000)
    }
  } catch (error: any) {
    console.error('Verify email error:', error)
    if (error?.data?.errorCode === 'invalid_code') {
      handleError('Código de verificação inválido')
    } else {
      handleError('Erro ao verificar código')
    }
  } finally {
    loading.value = false
  }
}

const resendCode = async () => {
  if (!email.value) {
    handleWarning('Email não fornecido')
    return
  }

  if (!whitelabel.value?._id) {
    handleError('Erro ao identificar a loja')
    return
  }

  resending.value = true

  try {
    const response = await post('/auth/resend-verification', {
      email: email.value,
      whitelabelId: whitelabel.value._id,
    }) as any

    if (response.code === 'success') {
      handleSuccess('Código reenviado! Verifique seu email.')
    } else if (response.code === 'already_verified') {
      handleInfo('Sua conta já está verificada')
      router.push('/?login=true')
    }
  } catch (error: any) {
    console.error('Resend code error:', error)
    handleError('Erro ao reenviar código')
  } finally {
    resending.value = false
  }
}
</script>

<style scoped lang="scss">
.verify-email-page {
  min-height: calc(100vh - 64px);
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
  padding: 40px 24px;

  .verify-email-card {
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    border-radius: 12px;

    .header {
      text-align: center;
      margin-bottom: 32px;

      .v-icon {
        margin-bottom: 16px;
      }

      h1 {
        font-size: 1.75rem;
        font-weight: 700;
        color: #1d1d1f;
        margin: 0 0 12px 0;
      }

      .subtitle {
        font-size: 0.9375rem;
        color: #86868b;
        line-height: 1.6;
        margin: 0;

        strong {
          color: #1d1d1f;
        }
      }
    }

    .form {
      margin-top: 24px;

      .code-input {
        :deep(input) {
          text-align: center;
          font-size: 1.5rem;
          letter-spacing: 0.5rem;
          font-weight: 600;
          font-family: monospace;
        }
      }
    }

    .resend-container {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 16px;
      gap: 4px;

      span {
        font-size: 0.875rem;
        color: #666;
      }

      .v-btn {
        text-transform: none;
        font-size: 0.875rem;
      }
    }

    .success-message {
      text-align: center;
      padding: 20px 0;

      h2 {
        font-size: 1.5rem;
        font-weight: 600;
        color: #1d1d1f;
        margin: 16px 0;
      }

      p {
        font-size: 1rem;
        color: #666;
        line-height: 1.6;
        margin: 12px 0;
      }

      .small-text {
        font-size: 0.875rem;
        color: #999;
      }
    }
  }
}
</style>
