import type { IWhitelabel, IWhitelabelError } from '~/types/whitelabel'

export const useWhitelabel = () => {
  const whitelabel = useState<IWhitelabel>('whitelabel-cache')

  const { get } = useApi()
  const router = useRouter()
  const url = useRequestURL()

  onMounted(() => {
    if (import.meta.client) {
      handleChangePalette({
        primary: whitelabel.value?.primaryColor || '',
        secondary: whitelabel.value?.secondaryColor || '',
      })
    }
  })

  const hasWhitelabel = computed(() => !!whitelabel.value)

  const getWhitelabel = async () => {
    try {
      console.log('requisitando whitelabel')
      const response = await $fetch(`/api/whitelabel/${url.host}`)
      if ((response as IWhitelabelError)?.code === 404) {
        console.warn('Not found whitelabel, redirecting to /whitelabel-configuration', response)
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
      return 'error'
    }
  }

  return {
    whitelabel,
    getWhitelabel,
    hasWhitelabel,
  }
}
