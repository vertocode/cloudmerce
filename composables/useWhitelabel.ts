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
        console.warn('Not found whitelabel, redirecting to /admin-setup', response)
        await router.push('/admin-setup')
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

  const refreshWhitelabel = async () => {
    try {
      console.log('[useWhitelabel] Force refreshing whitelabel data')
      // Force fresh fetch by adding cache-busting timestamp
      const response = await $fetch(`/api/whitelabel/${url.host}?t=${Date.now()}`, {
        headers: {
          'Cache-Control': 'no-cache',
        },
      })

      if ((response as IWhitelabelError)?.code === 404) {
        console.warn('Not found whitelabel', response)
        return 'error'
      }
      if (!(response as IWhitelabel).name) throw new Error('Something wrong in the response data')

      whitelabel.value = response as IWhitelabel
      console.log('[useWhitelabel] Whitelabel refreshed successfully:', response)
      return response as IWhitelabel
    }
    catch (error) {
      console.error('[useWhitelabel] Error refreshing whitelabel:', error)
      return 'error'
    }
  }

  return {
    whitelabel,
    getWhitelabel,
    refreshWhitelabel,
    hasWhitelabel,
  }
}
