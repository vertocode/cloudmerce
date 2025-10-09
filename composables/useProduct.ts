import type { IProduct, IProductResponse } from '~/types/product'
import { shouldRevalidateProduct } from '~/utils/revalidation'

interface IUseProduct {
  updateProductList?: (param: { cache: 'no-cache' | 'force-cache' }) => Promise<void>
}

export const useProduct = ({ updateProductList }: IUseProduct) => {
  const loading = ref(false)

  const { remove, get, clearProductsCache } = useApi()

  const getProductById = async (id: string, options?: { cache?: 'no-cache' | 'force-cache' }): Promise<IProduct | null> => {
    const { whitelabel } = useWhitelabel()

    try {
      loading.value = true

      // Check if this product needs revalidation from localStorage
      const needsRevalidation = shouldRevalidateProduct(id)
      const forceNoCache = options?.cache === 'no-cache' || needsRevalidation

      const url = forceNoCache
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

      // Clear all products cache for this ecommerce
      await clearProductsCache(whitelabel.value._id)

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
