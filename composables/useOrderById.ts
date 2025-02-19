import type { Order, OrderStatus } from '~/types/order'

export const useOrderById = (id: string) => {
  const order = useState<Order | null>(`order-${id}`, () => null)
  const loading = useState<boolean>(`loading-order-${id}`, () => false)
  const { whitelabel } = useWhitelabel()

  const { get, put } = useApi()

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
    try {
      loading.value = true
      order.value = await get(`/order/${id}/${whitelabel.value._id}`) as Order
    }
    catch (error) {
      console.error(`Erro ao buscar pedido ${id}:`, error)
      order.value = null
    }
    finally {
      loading.value = false
    }
  }

  const changeStatus = async (status: OrderStatus) => {
    try {
      loading.value = true
      const response = await put(`/update-order-status`, {
        orderId: id,
        status,
      }) as Order

      if (!order.value) {
        throw new Error('Pedido não encontrado')
      }

      order.value.status = response.status
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
    changeStatus,
  }
}
