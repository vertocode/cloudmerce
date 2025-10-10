<template>
  <div class="register-page">
    <VCard class="register-card" max-width="500">
      <VCardText>
        <div class="header">
          <VIcon size="64" color="primary">
            mdi-account-plus
          </VIcon>
          <h1>Criar Conta</h1>
          <p class="subtitle">
            Preencha os dados abaixo para criar sua conta.
          </p>
        </div>

        <VeeForm
          v-if="!registered"
          v-slot="{ isSubmitting }"
          :validation-schema="validationSchema"
          @submit="handleSubmit"
          class="form"
        >
          <VeeTextField
            name="name"
            label="Nome"
            variant="outlined"
            prepend-inner-icon="mdi-account"
            class="mb-4"
          />

          <VeeTextField
            name="email"
            label="E-mail"
            variant="outlined"
            prepend-inner-icon="mdi-email"
            class="mb-4"
          />

          <VeeTextField
            name="password"
            label="Senha"
            :type="showPassword ? 'text' : 'password'"
            variant="outlined"
            prepend-inner-icon="mdi-lock"
            :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append-inner="showPassword = !showPassword"
            class="mb-4"
          />

          <VeeTextField
            name="repeatPassword"
            label="Repetir Senha"
            :type="showConfirmPassword ? 'text' : 'password'"
            variant="outlined"
            prepend-inner-icon="mdi-lock-check"
            :append-inner-icon="showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append-inner="showConfirmPassword = !showConfirmPassword"
            class="mb-4"
          />

          <VeeCheckbox
            name="terms"
            class="mb-4"
          >
            <template #label>
              <div class="terms-label">
                <span>Declaro que li e aceito as</span>
                <span
                  class="privacy-link"
                  @click.prevent="$router.push('/privacy')"
                > políticas de privacidade</span>.
              </div>
            </template>
          </VeeCheckbox>

          <VBtn
            type="submit"
            color="primary"
            block
            size="large"
            :loading="isSubmitting"
          >
            Criar Conta
          </VBtn>

          <div class="login-link">
            <span>Já tem uma conta?</span>
            <VBtn
              variant="text"
              size="small"
              color="primary"
              @click="$router.push('/?login=true')"
            >
              Fazer Login
            </VBtn>
          </div>
        </VeeForm>

        <div v-else class="success-message">
          <VIcon size="80" color="success" class="mb-4">
            mdi-check-circle
          </VIcon>
          <h2>Conta Criada!</h2>
          <p>
            Sua conta foi criada com sucesso.
          </p>
          <p class="small-text">
            Agora você pode fazer login e começar a usar nossos serviços.
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
import { z } from 'zod'

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const registered = ref(false)

const { register } = useUser()
const router = useRouter()

const validationSchema = z.object({
  name: z.string().min(3, { message: 'Nome deve ter pelo menos 3 caracteres' }),
  email: z.string().email({ message: 'E-mail inválido' }),
  password: z.string().min(6, { message: 'Senha deve ter pelo menos 6 caracteres' }),
  repeatPassword: z.string().min(6, { message: 'A senha de repetição deve ter pelo menos 6 caracteres' }),
  terms: z.boolean().refine(val => val === true, { message: 'Você deve aceitar os termos de uso e a política de privacidade' }),
}).refine(fields => fields.password === fields.repeatPassword, {
  message: 'As senhas não coincidem',
  path: ['repeatPassword'],
})

const handleSubmit = async (values: Record<string, any>) => {
  if (!values.name || !values.email || !values.password) {
    handleWarning('Por favor, preencha todos os campos')
    return
  }

  if (values.password !== values.repeatPassword) {
    handleWarning('As senhas não coincidem')
    return
  }

  if (!values.terms) {
    handleWarning('Você deve aceitar os termos e políticas de privacidade')
    return
  }

  try {
    const response = await register({
      name: values.name,
      email: values.email,
      password: values.password,
      acceptedTerms: values.terms,
    })

    if (response.code === 'success') {
      // Redirect to verification page with email
      router.push(`/verify-email?email=${encodeURIComponent(response.email)}`)
    } else if (response.code === 'user_already_exists') {
      // Error message already shown by useUser composable
      return
    }
  } catch (error: any) {
    console.error('Register error:', error)
    handleError('Erro ao criar conta')
  }
}
</script>

<style scoped lang="scss">
.register-page {
  min-height: calc(100vh - 64px);
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
  padding: 40px 24px;

  .register-card {
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

    .terms-label {
      font-size: 0.875rem;

      .privacy-link {
        color: var(--primary-color-500);
        cursor: pointer;
        text-decoration: underline;

        &:hover {
          color: var(--secondary-color-500);
        }
      }
    }

    .login-link {
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
