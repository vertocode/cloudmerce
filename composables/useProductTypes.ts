export interface IProductType {
  id: string
  name: string
}

interface IProductTypeResponse {
  _id: string
  name: string
  createdAt: string
  updatedAt: string
  ecommerceId: string
}

interface IUpdateProductTypes {
  cache?: 'no-cache' | 'force-cache'
}

export const useProductTypes = () => {
  const { get } = useApi()

  const productTypes = useState<IProductType[]>(() => [])

  const updateProductTypes = async ({ cache }: IUpdateProductTypes) => {
    try {
      if (productTypes.value.length && cache !== 'no-cache') return

      const { getWhitelabel } = useWhitelabel()

      const whitelabel = await getWhitelabel()

      if (!whitelabel) {
        throw new Error('Whitelabel not found')
      }

      const response = await get(`/product-types/ecommerce/${whitelabel._id}`, {}, {
        cache: cache || 'force-cache',
      }) as IProductTypeResponse[]
      productTypes.value = response.map((productType: IProductTypeResponse) => ({
        id: productType?._id,
        name: productType.name,
      }))
    }
    catch (e) {
      console.error(e)
    }
  }

  callOnce('updateProductTypes', () => updateProductTypes({ cache: 'no-cache' }))

  const getProductTypeById = (id: string) => {
    return productTypes.value.find(productType => productType.id === id)
  }

  return {
    productTypes,
    getProductTypeById,
    updateProductTypes,
  }
}
