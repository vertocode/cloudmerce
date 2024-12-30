import type { IWhitelabel, IWhitelabelError } from '~/types/whitelabel'

export const useWhitelabel = () => {
  const whitelabel = useState<IWhitelabel | null | 404>('whitelabel', () => null)

  const { get } = useApi()
  const router = useRouter()
  const url = useRequestURL()

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

    try {
      const response = await get(`/whitelabel/${url.host}`)
      if ((response as IWhitelabelError)?.code === 404) {
        console.warn('Not found whitelabel, redirecting to /whitelabel-configuration', response)
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

  const getWhitelabelWPaymentData = async () => {
    const wData = await getWhitelabel() as IWhitelabel
    if (wData?.paymentData) return wData

    try {
      const response = await get(`/whitelabel/payment-data/${url.host}`)

      if ((response as IWhitelabelError)?.code === 404) {
        console.warn('Not found whitelabel, redirecting to /whitelabel-configuration', response)
        whitelabel.value = 404
        await router.push('/whitelabel-configuration')
        return
      }

      const newData = {
        ...whitelabel.value as IWhitelabel,
        paymentData: response as IWhitelabel['paymentData'],
      }

      whitelabel.value = newData
      return newData
    }
    catch (error) {
      handleError('Erro inesperado ao buscar dados da loja')
      console.error('Error getting whitelabel:', error)
    }
  }

  return {
    whitelabel,
    getWhitelabel,
    getWhitelabelWPaymentData,
  }
}
