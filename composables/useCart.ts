import { computed } from 'vue'
import type { IAddItemToCartResponse, ICartItem, IExpiredCartItem, IGetCartResponse } from '~/types/cart'

export const useCart = () => {
  const isCartDrawerOpened = useState('isCartDrawerOpened', () => false)
  const cartProducts = useState<(ICartItem | IExpiredCartItem)[]>('cartProducts', () => [])
  const ownerId = useState<string | null>('ownerId', () => null)
  const loading = useState<boolean>('cartLoading', () => true)

  const route = useRoute()
  const { getWhitelabel } = useWhitelabel()
  const { put, get } = useApi()

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

      const whitelabel = await getWhitelabel()

      if (!whitelabel) {
        throw new Error('Whitelabel not found')
      }

      const response = await get(`/get-cart/${whitelabel._id}`, { cartId: cartId.value }) as IGetCartResponse

      if (!response?._id) {
        throw new Error('Response without _id.')
      }
      if (response?.userId) {
        ownerId.value = response.userId
      }
      cartProducts.value = response.items.map((item) => {
        const productDetails = item.productId

        // If it's null, it means that this product is not available anymore
        if (!productDetails) {
          return {
            id: item._id,
            status: 'expired',
          }
        }

        return {
          id: productDetails._id,
          status: 'active',
          name: productDetails.name,
          price: productDetails.price,
          image: productDetails.image,
          quantity: item.quantity,
          description: productDetails.description,
          productType: productDetails.productType,
          fields: productDetails?.fields?.map((field) => {
            const fieldValue = item.fieldValues.find(f => f.fieldLabel === field.label)
            return {
              label: fieldValue?.fieldLabel || '',
              type: field.type,
              value: fieldValue?.value || '',
            }
          }) || [],
        }
      })
    }
    catch (error) {
      console.error(error)
      handleError('Erro ao buscar carrinho.')
    }
    finally {
      loading.value = false
    }
  }

  const addToCart = async (item: ICartItem): Promise<{ code: string }> => {
    try {
      loading.value = true

      const whitelabel = await getWhitelabel()

      if (!whitelabel) {
        throw new Error('Whitelabel not found')
      }

      const response = await put(`/add-cart-item/${whitelabel._id}`, {
        cartId: cartId.value,
        productId: item.id,
        quantity: 1,
        fields: item.fields.map(field => ({ fieldLabel: field.label, value: field?.value })),
      }) as IAddItemToCartResponse

      if (!response?._id) {
        throw new Error('Response without _id.')
      }

      localStorage.setItem('cartId', response._id)

      await getCart()

      if (!route.path.includes('/checkout')) {
        isCartDrawerOpened.value = true
      }
      else {
        handleSuccess(`${item.name} adicionado ao carrinho.`)
      }

      return { code: 'success' }
    }
    catch (error) {
      console.error(error)
      handleError('Erro ao adicionar item ao carrinho.')

      return { code: 'error' }
    }
    finally {
      loading.value = false
    }
  }
  const changeQuantity = async (item: ICartItem | IExpiredCartItem, newQuantity: number): Promise<{ code: string }> => {
    const availableItem = item as ICartItem

    try {
      loading.value = true
      const whitelabel = await getWhitelabel()

      if (!whitelabel) {
        throw new Error('Whitelabel not found')
      }

      const isAvailable = !!availableItem.name

      const commonParams = {
        cartId: cartId.value,
        quantity: newQuantity,
        fields: isAvailable ? availableItem?.fields?.map(field => ({ fieldLabel: field.label, value: field?.value })) : [],
      }

      const differentParams = isAvailable ? { productId: item.id } : { cartItemId: item.id }

      const response = await put(`/change-cart-item-quantity/${whitelabel._id}`, {
        ...commonParams,
        ...differentParams,
      }) as IAddItemToCartResponse

      const hasDeletedCart = (response as unknown as { message: string })?.message?.includes('deleted')

      if (hasDeletedCart) {
        removeCartId()
        cartProducts.value = []
        isCartDrawerOpened.value = false
        handleSuccess('Carrinho limpo com sucesso, continue comprando!')
        return { code: 'success' }
      }

      if (!response?._id) {
        throw new Error('Response without _id.')
      }

      await getCart()

      if (newQuantity === 0 && availableItem?.name) {
        handleSuccess(`${availableItem?.name || 'Produto'} removido do carrinho.`)
      }

      return { code: 'success' }
    }
    catch (error) {
      console.error(error)

      if (newQuantity === 0) {
        handleError(`Erro ao remover ${availableItem?.name || 'Produto'} do carrinho.`)
      }
      else {
        handleError(`Erro ao mudar quantidade de ${availableItem?.name || 'produto'} no carrinho para ${newQuantity}.`)
      }

      return { code: 'error' }
    }
    finally {
      loading.value = false
    }
  }

  const total = computed(() => {
    return cartProducts.value.reduce((sum, product) => {
      if (product?.status === 'expired') {
        return sum
      }
      return sum + (product?.price * product.quantity)
    }, 0).toFixed(2)
  })

  return { cartProducts, loading, isCartDrawerOpened, total, cartId, ownerId, removeCartId, addToCart, changeQuantity, getCart }
}
