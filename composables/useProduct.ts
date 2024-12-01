import type { IProduct, IProductResponse } from '~/types/product'

interface IUseProduct {
  product?: IProduct
  updateProductList?: (param: { cache: 'no-cache' | 'force-cache' }) => Promise<void>
}

export const useProduct = ({ product, updateProductList }: IUseProduct) => {
  const loading = ref(false)

  const { remove, get } = useApi()
  const { ecommerceId } = useStoreData()

  const getProductById = async (id: string): Promise<IProduct | null> => {
    try {
      loading.value = true
      const response = await get(`/products/${ecommerceId}/${id}`) as IProductResponse

      return {
        id: response._id,
        name: response.name,
        price: response.price,
        description: response.description,
        productType: response.productType,
        image: response.image,
        fields: response.fields,
      }
    }
    catch (error) {
      console.error(error)
      return null
    }
  }

  const handleDelete = async () => {
    try {
      loading.value = true
      await remove(`/products/${product.id}`)
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
