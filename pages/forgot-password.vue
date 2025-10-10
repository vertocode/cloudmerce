<template>
  <div class="forgot-password-page">
    <VCard class="forgot-password-card" max-width="500">
      <VCardText>
        <div class="header">
          <VIcon size="64" color="primary">
            mdi-lock-reset
          </VIcon>
          <h1>Recuperar Senha</h1>
          <p class="subtitle">
            Digite seu email e enviaremos um link para redefinir sua senha.
          </p>
        </div>

        <VForm v-if="!emailSent" @submit.prevent="handleSubmit" class="form">
          <VTextField
            v-model="email"
            label="Email"
            type="email"
            variant="outlined"
            prepend-inner-icon="mdi-email"
            required
            :disabled="loading"
            class="mb-4"
          />

          <VBtn
            type="submit"
            color="primary"
            block
            size="large"
            :loading="loading"
          >
            Enviar Link de Recuperação
          </VBtn>

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
            mdi-email-check
          </VIcon>
          <h2>Email Enviado!</h2>
          <p>
            Se o email fornecido estiver cadastrado, você receberá instruções para
            redefinir sua senha.
          </p>
          <p class="small-text">
            Verifique sua caixa de entrada e spam.
          </p>
          <VBtn
            color="primary"
            block
            class="mt-6"
            @click="$router.push('/?login=true')"
          >
            Voltar para Login
          </VBtn>
        </div>
      </VCardText>
    </VCard>
  </div>
</template>

<script setup lang="ts">
const email = ref('')
const loading = ref(false)
const emailSent = ref(false)

const { post } = useApi()
const { whitelabel } = useWhitelabel()

const handleSubmit = async () => {
  if (!email.value) {
    handleWarning('Por favor, digite seu email')
    return
  }

  if (!whitelabel.value?._id) {
    handleError('Erro ao identificar a loja')
    return
  }

  loading.value = true

  try {
    await post('/auth/forgot-password', {
      email: email.value,
      whitelabelId: whitelabel.value._id,
    })

    emailSent.value = true
  } catch (error: any) {
    console.error('Forgot password error:', error)
    handleError('Erro ao solicitar recuperação de senha')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
.forgot-password-page {
  min-height: calc(100vh - 64px);
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
  padding: 40px 24px;

  .forgot-password-card {
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
      }
    }

    .form {
      margin-top: 24px;
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
