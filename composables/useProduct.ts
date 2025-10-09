import type { IProduct, IProductResponse } from '~/types/product'

interface IUseProduct {
  updateProductList?: (param: { cache: 'no-cache' | 'force-cache' }) => Promise<void>
}

export const useProduct = ({ updateProductList }: IUseProduct) => {
  const loading = ref(false)

  const { remove, get, clearCacheKey } = useApi()

  const getProductById = async (id: string, options?: { cache?: 'no-cache' | 'force-cache' }): Promise<IProduct | null> => {
    const { whitelabel } = useWhitelabel()

    try {
      loading.value = true
      const url = options?.cache === 'no-cache'
        ? `/api/products/${whitelabel.value._id}/${id}?t=${Date.now()}`
        : `/api/products/${whitelabel.value._id}/${id}`

      const response = await $fetch(url) as IProductResponse

      return {
        id: response._id,
        name: response.name,
        price: response.price,
        description: response.description,
        productType: response.productType,
        image: response.image,
        fields: response.fields,
        stock: response.stock,
      }
    }
    catch (error) {
      console.error(error)
      return null
    }
  }

  const handleDelete = async (product: IProduct) => {
    try {
      loading.value = true
      const { whitelabel } = useWhitelabel()
      await remove(`/products/${product.id}`)

      // Clear server-side cache for products
      await clearCacheKey(`products-${whitelabel.value._id}-{}`)
      await clearCacheKey(`product-${whitelabel.value._id}-${product.id}`)

      // Force refresh products list in the state
      const products = useState<any[]>('products', () => [])
      products.value = []

      handleSuccess(`Produto "${product.name}" deletado com sucesso!`)
      if (updateProductList) updateProductList({ cache: 'no-cache' })
    }
    catch (error) {
      console.error(error)
      handleError(`Erro ao deletar o produto "${product.name}"`)
    }
    finally {
      loading.value = false
    }
  }

  return {
    getProductById,
    handleDelete,
    loading,
  }
}
