import { shouldRevalidateProductTypes, clearProductTypesRevalidation } from '~/utils/revalidation'

export interface IProductType {
  icon?: string
  id: string
  name: string
}

interface IProductTypeResponse {
  _id: string
  name: string
  createdAt: string
  updatedAt: string
  ecommerceId: string
  icon: string
}

interface IUpdateProductTypes {
  cache?: 'no-cache' | 'force-cache'
}

export const useProductTypes = () => {
  const { get } = useApi()

  const productTypes = useState<IProductType[]>(() => [])

  const updateProductTypes = async ({ cache }: IUpdateProductTypes = {}) => {
    try {
      // Check if product types need revalidation from localStorage
      const needsRevalidation = shouldRevalidateProductTypes()
      const forceNoCache = cache === 'no-cache' || needsRevalidation

      if (productTypes.value.length && !forceNoCache) return

      const { whitelabel } = useWhitelabel()

      // Add timestamp to bypass cache when needed
      const url = forceNoCache
        ? `/api/product-types/${whitelabel.value._id}?t=${Date.now()}`
        : `/api/product-types/${whitelabel.value._id}`

      const response = await $fetch(url) as IProductTypeResponse[]

      // If response is empty and we're using cache, try revalidating once
      if (response.length === 0 && !forceNoCache) {
        console.log('[useProductTypes] Empty response from cache, revalidating...')
        const revalidateUrl = `/api/product-types/${whitelabel.value._id}?t=${Date.now()}`
        const revalidatedResponse = await $fetch(revalidateUrl) as IProductTypeResponse[]

        productTypes.value = revalidatedResponse.map((productType: IProductTypeResponse) => ({
          id: productType?._id,
          name: productType.name,
          icon: productType.icon,
        }))

        // Clear revalidation flag after successful fetch
        if (needsRevalidation) {
          clearProductTypesRevalidation()
        }
        return
      }

      productTypes.value = response.map((productType: IProductTypeResponse) => ({
        id: productType?._id,
        name: productType.name,
        icon: productType.icon,
      }))

      // Clear revalidation flag after successful fetch
      if (needsRevalidation) {
        clearProductTypesRevalidation()
      }
    }
    catch (e) {
      console.error(e)
    }
  }

  // Use cache on initial load instead of no-cache
  callOnce('updateProductTypes', () => updateProductTypes())

  const getProductTypeById = (id: string) => {
    return productTypes.value.find(productType => productType.id === id)
  }

  return {
    productTypes,
    getProductTypeById,
    updateProductTypes,
  }
}
