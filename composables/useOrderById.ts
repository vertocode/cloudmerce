import type { Order } from '~/types/order'

export const useOrderById = (id: string) => {
  const order = useState<Order | null>(`order-${id}`, () => null)
  const loading = useState<boolean>(`loading-order-${id}`, () => false)

  const { get } = useApi()

  const qrCodeImage = computed(() => {
    if (!order.value) return null

    const { qrCode: qrCodeBase64 } = order.value.paymentData || {}
    if (!qrCodeBase64) {
      console.error('QR Code base64 not found in order:', order.value)
      return null
    }

    return `data:image/png;base64,${qrCodeBase64}`
  })

  const pixCode = computed(() => {
    if (!order.value) return null

    const { pixCode } = order.value?.paymentData || {}

    if (!pixCode) {
      console.error('Pix Code not found in order:', order.value)
      return null
    }

    return pixCode
  })

  const fetchOrder = async () => {
    const { getWhitelabel } = useWhitelabel()

    try {
      const whitelabel = await getWhitelabel()

      if (!whitelabel) {
        throw new Error('Whitelabel not found')
      }

      loading.value = true
      order.value = await get(`/order/${id}/${whitelabel._id}`) as Order
    }
    catch (error) {
      console.error(`Erro ao buscar pedido ${id}:`, error)
      order.value = null
    }
    finally {
      loading.value = false
    }
  }

  onMounted(() => {
    fetchOrder()
  })

  return {
    order,
    loading,
    qrCodeImage,
    pixCode,
    fetchOrder,
  }
}
