import { computed } from 'vue'
import type { ICartItem, IExpiredCartItem, IGetCartResponse, ISubmitFnParams } from '~/types/cart'

export const useCart = () => {
  const isCartDrawerOpened = useState('isCartDrawerOpened', () => false)
  const cartProducts = useState<(ICartItem | IExpiredCartItem)[]>('cartProducts', () => [])
  const ownerId = useState<string | null>('ownerId', () => null)
  const loading = useState<boolean>('cartLoading', () => true)
  const loadingSubmit = ref(false)

  const route = useRoute()
  const { whitelabel } = useWhitelabel()
  const { put, get, post } = useApi()
  const router = useRouter()
  const { userData } = useUser()

  const cartId = computed(() => {
    if (import.meta.client) {
      return localStorage.getItem('cartId')
    }
    return null
  })

  const setProductsByAPIResponse = (response: IGetCartResponse) => {
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

      const response = await get(`/get-cart/${whitelabel.value._id}`, { cartId: cartId.value }) as IGetCartResponse

      if (response?.code === 'cart_not_found') {
        handleWarning('Carrinho não encontrado.')
        removeCartId()
        return
      }

      if (!response?._id) {
        throw new Error('Response without _id.')
      }
      if (response?.userId) {
        ownerId.value = response.userId
      }

      setProductsByAPIResponse(response)
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

      const response = await put(`/add-cart-item/${whitelabel.value._id}`, {
        cartId: cartId.value,
        productId: item.id,
        quantity: 1,
        fields: item.fields.map(field => ({ fieldLabel: field.label, value: field?.value })),
      }) as IGetCartResponse

      if (!response?._id) {
        throw new Error('Response without _id.')
      }

      localStorage.setItem('cartId', response._id)

      setProductsByAPIResponse(response)

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

      const isAvailable = !!availableItem.name

      const commonParams = {
        cartId: cartId.value,
        quantity: newQuantity,
        fields: isAvailable ? availableItem?.fields?.map(field => ({ fieldLabel: field.label, value: field?.value })) : [],
      }

      const differentParams = isAvailable ? { productId: item.id } : { cartItemId: item.id }

      const response = await put(`/change-cart-item-quantity/${whitelabel.value._id}`, {
        ...commonParams,
        ...differentParams,
      }) as IGetCartResponse

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

  const submit = async ({ paymentMethod, creditCardData }: ISubmitFnParams) => {
    try {
      if (loadingSubmit.value) {
        return
      }

      if (paymentMethod === 'credit_card' && (!creditCardData || Object.values(creditCardData).some(value => !value))) {
        handleWarning('Preencha os dados do cartão de crédito.')
        return
      }

      loadingSubmit.value = true

      const response = await post(`/order/${whitelabel.value._id}`, {
        cartId: cartId.value,
        userId: userData.value?._id,
        paymentData: {
          paymentMethod: paymentMethod,
          totalAmount: Number(total.value),
          creditCardData,
        },
      }) as { code: 'success' | 'error', order: { _id: string } }

      if (response?.code === 'success') {
        removeCartId()
        handleSuccess('Pedido realizado com sucesso!')
        const { _id: orderId } = response?.order || {}
        if (orderId) {
          await router.push(`/orders/${orderId}`)
        }
        else {
          handleError('Ocorreu um erro ao redirecionar para a página de pedido. Verifique na lista de pedidos.')
          await router.push('/orders')
        }
      }
      else {
        throw new Error('code not success')
      }
    }
    catch (error) {
      console.error('Error processing payment:', error)
      handleError('Ocorreu um erro inesperado, atualize a pagina e tente novamente.')
    }
    finally {
      loadingSubmit.value = false
    }
  }

  return { cartProducts, loading, isCartDrawerOpened, total, cartId, ownerId, loadingSubmit, removeCartId, addToCart, changeQuantity, getCart, submit }
}
