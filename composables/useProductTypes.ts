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

  const updateProductTypes = async ({ cache }: IUpdateProductTypes) => {
    try {
      if (productTypes.value.length && cache !== 'no-cache') return

      const { whitelabel } = useWhitelabel()

      const response = await $fetch(`/api/product-types/${whitelabel.value._id}`) as IProductTypeResponse[]
      productTypes.value = response.map((productType: IProductTypeResponse) => ({
        id: productType?._id,
        name: productType.name,
        icon: productType.icon,
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
