import type { IProduct, IProductResponse } from '~/types/product'

interface IUseProduct {
  updateProductList?: (param: { cache: 'no-cache' | 'force-cache' }) => Promise<void>
}

export const useProduct = ({ updateProductList }: IUseProduct) => {
  const loading = ref(false)

  const { remove, get } = useApi()

  const getProductById = async (id: string): Promise<IProduct | null> => {
    const { getWhitelabel } = useWhitelabel()

    const whitelabel = await getWhitelabel()

    if (!whitelabel) {
      throw new Error('Whitelabel not found')
    }
    try {
      loading.value = true
      const response = await get(`/products/${whitelabel._id}/${id}`) as IProductResponse

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

  const handleDelete = async (product: IProduct) => {
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
