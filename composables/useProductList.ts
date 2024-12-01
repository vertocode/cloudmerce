import type { IProduct, IProductFilters, IProductResponse } from '~/types/product'

export const useProductList = (filters?: IProductFilters) => {
  const products = useState<IProduct[]>('products', () => [])
  const lastFilters = useState<IProductFilters | null>(() => null)
  const loading = useState<boolean>(() => false)
  const search = useState<string>('filterSearchProducts', () => '')

  const { ecommerceId } = useStoreData()
  const { get } = useApi()

  interface IFetchProducts {
    cache?: 'force-cache' | 'no-cache'
  }
  const fetchProducts = async ({ cache }: IFetchProducts = {}) => {
    const prevFilters = lastFilters.value

    // If we already have the products, and don't have the filters or the filters are the same as the previous ones, we don't need to fetch the products again
    if (products.value.length && !filters && !prevFilters && cache !== 'no-cache') {
      return
    }

    // If the filters are the same as the previous ones, we don't need to fetch the products again
    if (filters && prevFilters?.productType === filters.productType && prevFilters?.search === filters.search && cache !== 'no-cache') {
      return
    }

    loading.value = true
    const response = await get(`/products/ecommerce/${ecommerceId}`, {
      ...filters,
      search: search.value || '',
    }, {
      cache: cache || 'force-cache',
    }) as IProductResponse[]

    products.value = response.map((product: IProductResponse): IProduct => ({
      id: product._id,
      name: product.name,
      image: product.image,
      description: product.description,
      price: product.price,
      productType: product.productType,
      fields: product.fields,
    }))
    lastFilters.value = filters || null

    loading.value = false
  }

  watch(search, () => fetchProducts({ cache: 'no-cache' }))

  onMounted(() => fetchProducts({ cache: 'no-cache' }))

  return {
    products,
    loading,
    update: fetchProducts,
  }
}
