import type { IWhitelabel, IWhitelabelError } from '~/types/whitelabel'

export const useWhitelabel = () => {
  const whitelabel = useState<IWhitelabel | null | 404>('whitelabel', () => null)

  onMounted(() => {
    if (import.meta.client) {
      if (whitelabel.value === 404) return

      handleChangePalette({
        primary: whitelabel.value?.primaryColor || '',
        secondary: whitelabel.value?.secondaryColor || '',
      })
    }
  })

  const getWhitelabel = async () => {
    if (whitelabel.value) return whitelabel.value

    const { get } = useApi()
    const router = useRouter()
    const url = useRequestURL()
    try {
      const response = await get(`/whitelabel/${url.host}`)
      if ((response as IWhitelabelError)?.code === 404) {
        whitelabel.value = 404
        await router.push('/whitelabel-configuration')
        return
      }
      if (!(response as IWhitelabel).name) throw new Error('Something wrong in the response data')

      whitelabel.value = response as IWhitelabel
      return response as IWhitelabel
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
