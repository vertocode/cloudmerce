import type { Order } from '~/types/order'

export const useOrderById = (id: string) => {
  const { ecommerceId } = useStoreData()
  const order = useState<Order | null>(`order-${id}`, () => null)
  const loading = useState<boolean>(`loading-order-${id}`, () => false)

  const { get } = useApi()
  const fetchOrder = async () => {
    try {
      loading.value = true
      order.value = await get(`/order/${id}/${ecommerceId}`) as Order
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
