import type {IProduct} from "~/types/product";

interface ICartResponse {
    createdAt: string
    updatedAt: string
    ecommerceId: string
    items: {
        productId: string
        quantity: number
        _id: string
    }[]
    _id: string
}

export const useCart = () => {
    const cartProducts = useState<IProduct[]>('cartProducts', () => [])
    const loading = ref<boolean>(false)

    const { put } = useApi()
    const { ecommerceId } = useStoreData()

    const cartId = computed(() => {
        return localStorage.getItem('cartId')
    })

    const addToCart = async (item: IProduct): Promise<{ code: string }> => {
        try {
            loading.value = true
            const response = await put(`/add-cart-item/${ecommerceId}`, {
                cartId: cartId.value,
                productId: item.id,
                quantity: 1,
                fields: item.fields.map(field => ({ fieldLabel: field.label, value: field?.value }))
            }) as ICartResponse

            if (!response?._id) {
                throw new Error('Response without _id.')
            }

            localStorage.setItem('cartId', response._id)

            cartProducts.value.push(item)
            handleSuccess(`${item.name} adicionado ao carrinho.`)

            return { code: 'success' }
        } catch (error) {
            console.error(error)
            handleError('Erro ao adicionar item ao carrinho.')

            return { code: 'error' }
        } finally {
            loading.value = false
        }
    }
    const removeFromCart = (id: string) => {
        cartProducts.value = cartProducts.value.filter((item) => item.id !== id)
    }

    return { cartProducts, loading, addToCart, removeFromCart }
}
