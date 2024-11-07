import type {IProduct} from "~/types/product";
import type {IAddItemToCartResponse, IGetCartResponse} from "~/types/cart";



export const useCart = () => {
    const cartProducts = useState<IProduct[]>('cartProducts', () => [])
    const loading = ref<boolean>(false)

    const { put, get } = useApi()
    const { ecommerceId } = useStoreData()

    const cartId = computed(() => {
        return localStorage.getItem('cartId')
    })

    const getCart = async () => {
        try {
            loading.value = true
            const response = await get(`/get-cart/${ecommerceId}`, { cartId: cartId.value }) as IGetCartResponse

            console.log(response, '<<<')
            if (!response?._id) {
                throw new Error('Response without _id.')
            }
            cartProducts.value = response.items.map(item => {
                const productDetails = item.productId

                return {
                    id: productDetails._id,
                    name: productDetails.name,
                    price: productDetails.price,
                    image: productDetails.image,
                    description: productDetails.description,
                    productType: productDetails.productType,
                    fields: productDetails?.fields?.map(field => {
                        const fieldValue = item.fieldValues.find(f => f.fieldLabel === field.label)
                        return {
                            label: fieldValue?.fieldLabel || '',
                            type: field.type,
                            value: fieldValue?.value || ''
                        }
                    }) || []
                }
            })
        } catch (error) {
            console.error(error)
            handleError('Erro ao buscar carrinho.')
        } finally {
            loading.value = false
        }
    }

    const addToCart = async (item: IProduct): Promise<{ code: string }> => {
        try {
            loading.value = true
            const response = await put(`/add-cart-item/${ecommerceId}`, {
                cartId: cartId.value,
                productId: item.id,
                quantity: 1,
                fields: item.fields.map(field => ({ fieldLabel: field.label, value: field?.value }))
            }) as IAddItemToCartResponse

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

    callOnce(() => {
        getCart()
    })

    return { cartProducts, loading, addToCart, removeFromCart, getCart }
}
