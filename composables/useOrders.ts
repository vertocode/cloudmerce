import type { Order } from '~/types/order'

export const useOrders = () => {
  const orders = useState<Order[]>('orders', () => [])
  const loading = useState<boolean>('loadingOrders', () => false)

  const { get } = useApi()

  const fetchOrders = async () => {
    loading.value = true
    try {
      const { whitelabel } = useWhitelabel()

      const userId = useUser().userData.value?._id
      if (!userId) {
        return []
      }
      const response = await get(`/orders/${whitelabel.value._id}`, { userId })
      orders.value = response as Order[]
    }
    catch (err) {
      console.error(err)
      handleError('Erro ao buscar pedidos')
    }
    finally {
      loading.value = false
    }
  }

  return { orders, loading, fetchOrders }
}
