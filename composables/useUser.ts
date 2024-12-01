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

  const isAdmin = computed(() => userData.value?.role === 'admin')
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
      const response = await get('/auth/login', authParams) as User | { errorCode: string }

      if ((response as { errorCode: string })?.errorCode === 'user_not_found') {
        handleWarning('Usuário não encontrado')
        return { code: 'user_not_found' }
      }

      if (!(response as User)?._id) {
        throw new Error('Response without user id')
      }
      setUser(response as User)
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
      const response = await post('/users', registerParams)
      const userResponse = response as User
      if (!userResponse?._id) {
        throw new Error('Response without user id')
      }
      userData.value = userResponse
      storage.setItem('userData', userResponse)
      handleSuccess('Usuário cadastrado com sucesso!')
      return { code: 'success' }
    }
    catch (e) {
      console.error(e)
      handleError('Erro ao cadastrar usuário')
      return { code: 'error' }
    }
  }

  return {
    userData,
    isAdmin,
    isLogged,
    setUser,
    login,
    logout,
    register,
  }
}
