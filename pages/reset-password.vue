<template>
  <div class="reset-password-page">
    <VCard class="reset-password-card" max-width="500">
      <VCardText>
        <div class="header">
          <VIcon size="64" color="primary">
            mdi-lock-reset
          </VIcon>
          <h1>Redefinir Senha</h1>
          <p class="subtitle">
            Digite sua nova senha abaixo.
          </p>
        </div>

        <VForm v-if="!passwordReset" @submit.prevent="handleSubmit" class="form">
          <VTextField
            v-model="newPassword"
            label="Nova Senha"
            :type="showPassword ? 'text' : 'password'"
            variant="outlined"
            prepend-inner-icon="mdi-lock"
            :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append-inner="showPassword = !showPassword"
            required
            :disabled="loading"
            :rules="[rules.required, rules.minLength]"
            class="mb-4"
          />

          <VTextField
            v-model="confirmPassword"
            label="Confirmar Nova Senha"
            :type="showConfirmPassword ? 'text' : 'password'"
            variant="outlined"
            prepend-inner-icon="mdi-lock-check"
            :append-inner-icon="showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append-inner="showConfirmPassword = !showConfirmPassword"
            required
            :disabled="loading"
            :rules="[rules.required, rules.match]"
            class="mb-4"
          />

          <VBtn
            type="submit"
            color="primary"
            block
            size="large"
            :loading="loading"
          >
            Redefinir Senha
          </VBtn>
        </VForm>

        <div v-else class="success-message">
          <VIcon size="80" color="success" class="mb-4">
            mdi-check-circle
          </VIcon>
          <h2>Senha Redefinida!</h2>
          <p>
            Sua senha foi redefinida com sucesso.
          </p>
          <p class="small-text">
            Agora você pode fazer login com sua nova senha.
          </p>
          <VBtn
            color="primary"
            block
            class="mt-6"
            @click="$router.push('/?login=true')"
          >
            Ir para Login
          </VBtn>
        </div>
      </VCardText>
    </VCard>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const newPassword = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const loading = ref(false)
const passwordReset = ref(false)

const { post } = useApi()

const rules = {
  required: (v: string) => !!v || 'Campo obrigatório',
  minLength: (v: string) => v.length >= 6 || 'Mínimo de 6 caracteres',
  match: (v: string) => v === newPassword.value || 'As senhas não coincidem',
}

const handleSubmit = async () => {
  if (!newPassword.value || !confirmPassword.value) {
    handleWarning('Por favor, preencha todos os campos')
    return
  }

  if (newPassword.value !== confirmPassword.value) {
    handleWarning('As senhas não coincidem')
    return
  }

  if (newPassword.value.length < 6) {
    handleWarning('A senha deve ter pelo menos 6 caracteres')
    return
  }

  const token = route.query.token
  if (!token) {
    handleError('Token de redefinição não encontrado')
    return
  }

  loading.value = true

  try {
    const response = await post('/auth/reset-password', {
      token: token as string,
      newPassword: newPassword.value,
    }) as any

    if (response.errorCode === 'invalid_token') {
      handleError('Link de redefinição inválido ou expirado')
      return
    }

    passwordReset.value = true
    handleSuccess('Senha redefinida com sucesso!')
  } catch (error: any) {
    console.error('Reset password error:', error)
    if (error?.data?.errorCode === 'invalid_token') {
      handleError('Link de redefinição inválido ou expirado')
    } else {
      handleError('Erro ao redefinir senha')
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
.reset-password-page {
  min-height: calc(100vh - 64px);
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
  padding: 40px 24px;

  .reset-password-card {
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
