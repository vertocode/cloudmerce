import type { Order } from '~/types/order'

interface IFetchOrders {
  page?: number
  pageSize?: number
}

export const useAllOrders = () => {
  const orders = useState<Order[]>('allOrders', () => [])
  const totalPages = useState<number>('totalPages', () => 0)
  const loading = useState<boolean>('loadingAllOrders', () => false)

  const { get } = useApi()

  const fetchOrders = async ({ page, pageSize }: IFetchOrders = { page: 1, pageSize: 10 }) => {
    loading.value = true
    try {
      const { whitelabel } = useWhitelabel()

      const response = await get(`/orders-admin/${whitelabel.value._id}`, {
        page,
        pageSize,
      }) as { orders: Order[], totalPages: number }

      orders.value = response.orders
      totalPages.value = response.totalPages
    }
    catch (err) {
      console.error(err)
      handleError('Erro ao buscar pedidos')
    }
    finally {
      loading.value = false
    }
  }

  return { orders, loading, totalPages, fetchOrders }
}
