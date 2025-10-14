import { computed } from 'vue'
import type { User } from '~/types/user'

interface AuthParams {
  email: string
  password: string
}

interface RegisterParams {
  name: string
  email: string
  password: string
}

export const useUser = () => {
  const storage = makeStorage()

  const userData = useState<User | null>('userData', () => null)
  const { get, post } = useApi()
  const { whitelabel } = useWhitelabel()

  const isAdmin = computed(() => userData.value?.role === 'admin' || userData.value?.role === 'superadmin')
  const isSuperAdmin = computed(() => userData.value?.role === 'superadmin')
  const isLoggedIn = computed(() => !!userData.value)
  const isLogged = computed(() => !!userData.value)

  onMounted(() => {
    if (import.meta.client && !userData.value) {
      userData.value = storage.getItem<User>('userData')
    }
  })

  const setUser = (user: User) => {
    userData.value = user
    storage.setItem('userData', user)
  }

  const login = async (authParams: AuthParams) => {
    try {
      const response = await get('/auth/login', {
        whitelabelId: whitelabel.value._id,
        ...authParams,
      }) as any

      if (response?.errorCode === 'user_not_found') {
        handleWarning('Usuário não encontrado')
        return { code: 'user_not_found' }
      }

      if (response?.errorCode === 'account_not_verified') {
        handleWarning('Por favor, verifique sua conta com o código enviado por email')
        return {
          code: 'account_not_verified',
          email: response.email,
        }
      }

      if (!response?._id) {
        throw new Error('Response without user id')
      }
      setUser(response)
      return { code: 'success' }
    }
    catch (error) {
      console.error(error)
      handleError('Erro ao efetuar login')
      return { code: 'error' }
    }
  }

  const logout = () => {
    userData.value = null
    storage.removeItem('userData')
  }

  const register = async (registerParams: RegisterParams) => {
    try {
      const response = await post('/users', {
        whitelabelId: whitelabel.value._id,
        ...registerParams,
      }) as any

      // Check for user already exists error
      if (response?.errorCode === 'user_already_exists') {
        handleWarning('Um usuário com este email já está cadastrado')
        return { code: 'user_already_exists' }
      }

      if (!response?._id) {
        throw new Error('Response without user id')
      }

      // Don't set user data yet - they need to verify email first
      handleSuccess('Conta criada! Verifique seu email para o código de verificação.')
      return {
        code: 'success',
        email: response.email,
        userId: response._id,
      }
    }
    catch (e: any) {
      console.error(e)
      // Check if error has errorCode in the response
      if (e?.data?.errorCode === 'user_already_exists') {
        handleWarning('Um usuário com este email já está cadastrado')
        return { code: 'user_already_exists' }
      }
      handleError('Erro ao cadastrar usuário')
      return { code: 'error' }
    }
  }

  return {
    userData,
    isAdmin,
    isSuperAdmin,
    isLoggedIn,
    isLogged,
    setUser,
    login,
    logout,
    register,
  }
}
