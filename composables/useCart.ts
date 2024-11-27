import type {IAddItemToCartResponse, ICartItem, IGetCartResponse} from "~/types/cart";
import {computed} from "vue";

export const useCart = () => {
    const isCartDrawerOpened = useState('isCartDrawerOpened', () => false)
    const cartProducts = useState<ICartItem[]>('cartProducts', () => [])
    const ownerId = useState<string | null>('ownerId', () => null)
    const loading = useState<boolean>('cartLoading', () => true)

    const { put, get } = useApi()
    const { ecommerceId } = useStoreData()

    const cartId = computed(() => {
        if (import.meta.client) {
            return localStorage.getItem('cartId')
        }
        return null
    })

    const removeCartId = () => {
        if (cartId) {
            localStorage.removeItem('cartId')
        }
    }

    const getCart = async () => {
        if (!cartId.value) {
            loading.value = false
            return
        }
        try {
            loading.value = true
            const response = await get(`/get-cart/${ecommerceId}`, { cartId: cartId.value }) as IGetCartResponse

            if (!response?._id) {
                throw new Error('Response without _id.')
            }
            if (response?.userId) {
                ownerId.value = response.userId
            }
            cartProducts.value = response.items.map(item => {
                const productDetails = item.productId

                return {
                    id: productDetails._id,
                    name: productDetails.name,
                    price: productDetails.price,
                    image: productDetails.image,
                    quantity: item.quantity,
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

    const addToCart = async (item: ICartItem): Promise<{ code: string }> => {
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

            await getCart()

            isCartDrawerOpened.value = true

            return { code: 'success' }
        } catch (error) {
            console.error(error)
            handleError('Erro ao adicionar item ao carrinho.')

            return { code: 'error' }
        } finally {
            loading.value = false
        }
    }
    const changeQuantity = async (item: ICartItem, newQuantity: number): Promise<{ code: string }> => {
        try {
            loading.value = true
            const response = await put(`/change-cart-item-quantity/${ecommerceId}`, {
                cartId: cartId.value,
                productId: item.id,
                quantity: newQuantity,
                fields: item.fields.map(field => ({ fieldLabel: field.label, value: field?.value }))
            }) as IAddItemToCartResponse

            if (!response?._id) {
                throw new Error('Response without _id.')
            }

            await getCart()

            if (newQuantity === 0) {
                handleSuccess(`${item.name} removido do carrinho.`)
            }

            return { code: 'success' }
        } catch (error) {
            console.error(error)

            if (newQuantity === 0) {
                handleError(`Erro ao remover ${item.name} do carrinho.`)
            } else {
                handleError(`Erro ao mudar quantidade de ${item.name} no carrinho para ${newQuantity}.`)
            }

            return { code: 'error' }
        } finally {
            loading.value = false
        }
    }

    const total = computed(() => {
        return cartProducts.value.reduce((sum, product) => sum + (product.price * product.quantity), 0).toFixed(2)
    })

    return { cartProducts, loading, isCartDrawerOpened, total, cartId, ownerId, removeCartId, addToCart, changeQuantity, getCart }
}
