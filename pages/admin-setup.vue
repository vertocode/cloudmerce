<template>
  <div class="admin-setup-page">
    <VCard class="setup-card" max-width="500">
      <VCardText>
        <div class="setup-header">
          <VIcon size="64" color="primary">
            mdi-store-alert
          </VIcon>
          <h1>Loja Não Configurada</h1>
          <p class="subtitle">
            Esta loja ainda não foi configurada. Por favor, faça login como administrador para começar a configuração.
          </p>
        </div>

        <VForm @submit.prevent="handleLogin" class="login-form">
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

          <VTextField
            v-model="password"
            label="Senha"
            :type="showPassword ? 'text' : 'password'"
            variant="outlined"
            prepend-inner-icon="mdi-lock"
            :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append-inner="showPassword = !showPassword"
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
            Entrar e Configurar
          </VBtn>
        </VForm>
      </VCardText>
    </VCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
})

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)

// Modified useUser that doesn't require whitelabel
const { post } = useApi()
const router = useRouter()
const url = useRequestURL()

const handleLogin = async () => {
  if (!email.value || !password.value) {
    handleWarning('Por favor, preencha todos os campos')
    return
  }

  loading.value = true
  console.log('Starting login with:', { email: email.value, baseUrl: url.host })

  try {
    // Login without whitelabel requirement
    const response = await post('/auth/admin-setup', {
      email: email.value,
      password: password.value,
      baseUrl: url.host,
    }) as any

    console.log('Admin setup response:', response)
    console.log('Response type:', typeof response)
    console.log('Response keys:', Object.keys(response || {}))

    // Check for error codes
    if (response?.errorCode) {
      console.log('Error code detected:', response.errorCode)
      loading.value = false

      if (response.errorCode === 'user_not_found') {
        console.log('Showing user not found warning')
        handleWarning('Usuário não encontrado')
        return
      }

      if (response.errorCode === 'not_admin') {
        console.log('Showing not admin warning')
        handleWarning('Apenas administradores podem configurar a loja')
        return
      }

      if (response.errorCode === 'invalid_credentials') {
        console.log('Showing invalid credentials warning')
        handleWarning('Email ou senha inválidos')
        return
      }

      // Any other error code
      console.log('Showing generic error')
      handleError(`Erro: ${response.errorCode}`)
      return
    }

    // Check for successful response
    console.log('Checking success conditions:', {
      hasId: !!response?._id,
      role: response?.role,
      isAdmin: response?.role === 'admin'
    })

    if (response?._id && response?.role === 'admin') {
      console.log('Success! Storing user data...')

      // Store user data in both storage and state FIRST
      const storage = makeStorage()
      const userData = useState('userData')

      storage.setItem('userData', response)
      userData.value = response
      console.log('User data stored:', { userId: response._id, role: response.role, token: response.token })

      // If whitelabel was just created, set it in cache to avoid 404 redirects
      if (response.whitelabelCreated) {
        console.log('Whitelabel was just created, setting in cache to avoid redirects')
        const whitelabelCache = useState<any>('whitelabel-cache')

        // Set a minimal whitelabel object in cache so middleware doesn't redirect
        whitelabelCache.value = {
          _id: response.whitelabelId,
          baseUrl: url.host,
          name: 'Loja em Configuração',
          description: 'Esta loja está sendo configurada',
          primaryColor: '#000000',
          secondaryColor: '#000000',
          isActive: false,
        }

        console.log('Whitelabel cache set:', whitelabelCache.value)
      }

      handleSuccess('Login realizado com sucesso!')
      console.log('Success message shown, navigating to admin/settings...')

      // Wait a bit to ensure cookie is set
      await nextTick()

      // Use Vue Router for client-side only navigation (no SSR)
      await router.push('/admin/settings?openWhitelabelModal=true')
    } else {
      console.error('Unexpected response format:', response)
      console.error('Missing _id or not admin role')
      handleError('Resposta inesperada do servidor')
      loading.value = false
    }
  } catch (error: any) {
    console.error('Login error caught:', error)
    console.error('Error message:', error?.message)
    console.error('Error data:', error?.data)
    console.error('Error stack:', error?.stack)

    if (error?.data?.errorCode) {
      handleError(`Erro: ${error.data.errorCode}`)
    } else if (error?.message) {
      handleError(`Erro ao fazer login: ${error.message}`)
    } else {
      handleError('Erro ao fazer login')
    }

    loading.value = false
  }
}
</script>

<style scoped lang="scss">
.admin-setup-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 24px;

  .setup-card {
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);

    .setup-header {
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

    .login-form {
      margin-top: 24px;
    }
  }
}
</style>
