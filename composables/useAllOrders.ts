import type { Order } from '~/types/order'

interface IUseAllOrders {
  page: number
  pageSize: number
}

export const useAllOrders = ({ page, pageSize }: IUseAllOrders) => {
  const orders = useState<Order[]>('allOrders', () => [])
  const loading = useState<boolean>('loadingAllOrders', () => false)

  const { get } = useApi()

  const fetchOrders = async () => {
    loading.value = true
    try {
      const { whitelabel } = useWhitelabel()

      const response = await get(`/orders-admin/${whitelabel.value._id}`, {
        page,
        pageSize,
      })
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
