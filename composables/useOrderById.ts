import type { Order } from '~/types/order'

export const useOrderById = (id: string) => {
  const order = useState<Order | null>(`order-${id}`, () => null)
  const loading = useState<boolean>(`loading-order-${id}`, () => false)

  const { get } = useApi()
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
  }
}
