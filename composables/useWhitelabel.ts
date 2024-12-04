export const useWhitelabel = () => {
  const whitelabel = useState('whitelabel', () => null)

  const getWhitelabel = async () => {
    if (whitelabel.value) return whitelabel.value

    const { get } = useApi()
    const router = useRouter()
    const url = useRequestURL()
    try {
      console.log('pegando whitelabel...')
      const response = await get(`/whitelabel/${url.host}`)
      console.log('whitelabel:', response)
      if (response?.code === 404) {
        await router.push('/whitelabel-configuration')
      }
      whitelabel.value = response
      return response
    }
    catch (error) {
      handleError('Erro inesperado ao buscar dados da loja')
      console.error('Error getting whitelabel:', error)
    }
  }

  return {
    whitelabel,
    getWhitelabel,
  }
}
