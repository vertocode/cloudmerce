import type { Order } from '~/types/order'

interface IFetchOrders {
  page?: number
  pageSize?: number
  search?: string
}

export const useAllOrders = () => {
  const orders = useState<Order[]>('allOrders', () => [])
  const totalPages = useState<number>('totalPages', () => 0)
  const totalItems = useState<number>('totalOrders', () => 0)
  const loading = useState<boolean>('loadingAllOrders', () => false)
  const currentPage = useState<number>('allOrdersPage', () => 1)

  const { get } = useApi()

  const fetchOrders = async ({ page, pageSize, search }: IFetchOrders = { page: 1, pageSize: 10 }) => {
    loading.value = true
    try {
      const { whitelabel } = useWhitelabel()

      if (!whitelabel.value?._id) {
        console.error('[useAllOrders] No whitelabel ID available')
        orders.value = []
        return
      }

      const ecommerceId = String(whitelabel.value._id)
      console.log('[useAllOrders] Fetching orders for ecommerceId:', ecommerceId, 'page:', page, 'pageSize:', pageSize)

      const response = await get(`/orders-admin/${ecommerceId}`, {
        page: String(page),
        pageSize: String(pageSize),
      }) as { orders: Order[], totalPages: number, totalOrders: number }

      console.log('[useAllOrders] Response:', response)

      orders.value = response.orders || []
      totalPages.value = response.totalPages || 0
      totalItems.value = response.totalOrders || 0
      currentPage.value = page || 1
    }
    catch (err) {
      console.error('[useAllOrders] Error:', err)
      handleError('Erro ao buscar pedidos')
      orders.value = []
    }
    finally {
      loading.value = false
    }
  }

  const onChangePage = (page: number) => {
    fetchOrders({ page, pageSize: 25 })
  }

  return { orders, loading, totalPages, totalItems, currentPage, fetchOrders, onChangePage }
}
