<template>
  <Modal
    :is-opened="showLoginModal"
    persistent
    :card-props="{}"
    :max-width="'480'"
    @close="onClose"
  >
    <template #trigger>
      <div @click="showLoginModal = true">
        <slot />
      </div>
    </template>

    <div class="login-modal-content">
      <div class="modal-header">
        <div class="icon-wrapper">
          <VIcon size="48" color="primary">
            mdi-account-circle
          </VIcon>
        </div>
        <h2 class="modal-title">Bem-vindo de volta</h2>
        <p class="modal-subtitle">Entre com suas credenciais para continuar</p>
      </div>

      <VeeForm
        v-slot="{ isSubmitting }"
        :validation-schema="validationSchema"
        @submit="submit"
        class="login-form"
      >
        <div class="form-fields">
          <VeeTextField
            name="email"
            label="E-mail"
            variant="outlined"
            prepend-inner-icon="mdi-email-outline"
            placeholder="seu@email.com"
            class="form-field"
          />

          <VeeTextField
            name="password"
            label="Senha"
            variant="outlined"
            :type="showPassword ? 'text' : 'password'"
            prepend-inner-icon="mdi-lock-outline"
            :append-inner-icon="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
            @click:append-inner="showPassword = !showPassword"
            placeholder="Digite sua senha"
            class="form-field"
          />

          <div class="forgot-password-container">
            <VBtn
              variant="text"
              size="small"
              class="forgot-password-link"
              @click="goToForgotPassword"
            >
              Esqueceu sua senha?
            </VBtn>
          </div>
        </div>

        <div class="form-actions">
          <VeeButton
            color="primary"
            size="large"
            block
            type="submit"
            :loading="isSubmitting"
            class="login-button"
          >
            Entrar
          </VeeButton>

          <VBtn
            variant="outlined"
            size="large"
            block
            @click="onClose"
            class="cancel-button"
          >
            Cancelar
          </VBtn>
        </div>

        <VDivider class="divider" />

        <div class="signup-container">
          <span class="signup-text">Não tem uma conta?</span>
          <VBtn
            variant="text"
            color="primary"
            class="signup-link"
            @click="goToRegister"
          >
            Cadastre-se aqui
          </VBtn>
        </div>
      </VeeForm>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { z } from 'zod'
import { ref } from 'vue'
import Modal from '~/components/El/Modal/index.vue'
import { useUser } from '~/composables/useUser'

const validationSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'E-mail é obrigatório' })
    .email({ message: 'E-mail inválido' }),
  password: z
    .string()
    .min(1, { message: 'Senha é obrigatória' })
    .min(6, { message: 'Senha deve ter pelo menos 6 caracteres' }),
})

const isLoading = ref(false)
const showLoginModal = ref(false)
const showPassword = ref(false)
const { login } = useUser()
const router = useRouter()
const route = useRoute()

// Open modal if login query param is present (client-side only)
if (import.meta.client) {
  watch(() => route.query.login, (newValue) => {
    if (newValue === 'true') {
      showLoginModal.value = true
      // Clean up the URL
      nextTick(() => {
        router.replace({ query: {} })
      })
    }
  }, { immediate: true })
}

const onClose = () => {
  showLoginModal.value = false
}

const goToForgotPassword = () => {
  showLoginModal.value = false
  router.push('/forgot-password')
}

const goToRegister = () => {
  showLoginModal.value = false
  router.push('/register')
}

const submit = async (values: { email: string, password: string }) => {
  isLoading.value = true

  const response = await login({
    email: values.email,
    password: values.password,
  })

  isLoading.value = false

  if (response.code === 'success') {
    showLoginModal.value = false
  } else if (response.code === 'account_not_verified') {
    showLoginModal.value = false
    router.push(`/verify-email?email=${encodeURIComponent(response.email)}`)
  }
}
</script>

<style scoped lang="scss">
.login-modal-content {
  padding: 16px 8px;
}

.modal-header {
  text-align: center;
  margin-bottom: 32px;

  .icon-wrapper {
    margin-bottom: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .modal-title {
    font-size: 1.75rem;
    font-weight: 600;
    color: #1d1d1f;
    margin: 0 0 8px 0;
    line-height: 1.3;
  }

  .modal-subtitle {
    font-size: 0.9375rem;
    color: #6b7280;
    margin: 0;
    line-height: 1.5;
  }
}

.login-form {
  .form-fields {
    margin-bottom: 24px;

    .form-field {
      margin-bottom: 20px;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  .forgot-password-container {
    display: flex;
    justify-content: flex-end;
    margin-top: -8px;
    margin-bottom: 8px;

    .forgot-password-link {
      text-transform: none;
      font-size: 0.875rem;
      color: #667eea;
      font-weight: 500;
      padding: 4px 8px;

      &:hover {
        color: #764ba2;
        background-color: rgba(102, 126, 234, 0.08);
      }
    }
  }

  .form-actions {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 24px;

    .login-button {
      font-weight: 600;
      text-transform: none;
      letter-spacing: 0.5px;
      box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
      transition: all 0.3s ease;

      &:hover {
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        transform: translateY(-1px);
      }

      &:active {
        transform: translateY(0);
      }
    }

    .cancel-button {
      text-transform: none;
      font-weight: 500;
      border: 1.5px solid #e5e7eb;
      color: #6b7280;

      &:hover {
        border-color: #d1d5db;
        background-color: #f9fafb;
      }
    }
  }

  .divider {
    margin: 24px 0;
    opacity: 0.6;
  }

  .signup-container {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    flex-wrap: wrap;

    .signup-text {
      font-size: 0.9375rem;
      color: #6b7280;
    }

    .signup-link {
      text-transform: none;
      font-size: 0.9375rem;
      font-weight: 600;
      padding: 4px 8px;
      letter-spacing: 0.3px;

      &:hover {
        background-color: rgba(102, 126, 234, 0.08);
      }
    }
  }
}

// Enhanced field styling
:deep(.v-text-field) {
  .v-field {
    border-radius: 8px;
    transition: all 0.3s ease;

    &:hover {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }
  }

  .v-field--focused {
    box-shadow: 0 2px 12px rgba(102, 126, 234, 0.15);
  }

  .v-field__prepend-inner {
    .v-icon {
      opacity: 0.7;
    }
  }

  .v-field--focused .v-field__prepend-inner .v-icon {
    opacity: 1;
    color: rgb(var(--v-theme-primary));
  }
}
</style>
