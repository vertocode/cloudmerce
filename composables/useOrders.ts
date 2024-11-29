export const useOrders = () => {
    const orders = useState('orders', () => [])
    const loading = useState('loadingOrders', () => false)

    const { get } = useApi()

    const fetchOrders = async () => {
        loading.value = true
        try {
            const userId = useUser().userData.value?._id
            const ecommerceId = useStoreData().ecommerceId
            if (!userId) {
                handleError('Usuário não autenticado')
                return
            }
            const response = await get(`/orders/${ecommerceId}`, { userId })
            orders.value = response
        } catch (err) {
            console.error(err)
            handleError('Erro ao buscar pedidos')
        } finally {
            loading.value = false
        }
    }

    return { orders, loading, fetchOrders }
}
