import type { IGetProductsResponse, IProduct, IProductFilters, IProductResponse } from '~/types/product'

export const useProductList = (filters?: IProductFilters) => {
  const products = useState<IProduct[]>('products', () => [])
  const lastFilters = useState<IProductFilters | null>(() => null)
  const loading = useState<boolean>(() => false)
  const search = useState<string>('filterSearchProducts', () => '')
  const currentPage = ref(1)
  const totalPages = ref(1)

  const onChangePage = (page: number) => {
    currentPage.value = page
  }

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

    const { getWhitelabel } = useWhitelabel()

    const whitelabel = await getWhitelabel()

    if (!whitelabel) {
      throw new Error('Whitelabel not found')
    }

    loading.value = true
    const response = await get(`/products/ecommerce/${whitelabel._id}`, {
      ...filters,
      search: search.value || '',
      limit: 20,
      page: currentPage.value,
    }, {
      cache: cache || 'force-cache',
    }) as IGetProductsResponse

    products.value = response.products.map((product: IProductResponse): IProduct => ({
      id: product._id,
      name: product.name,
      image: product.image,
      description: product.description,
      price: product.price,
      productType: product.productType,
      fields: product.fields,
    }))
    totalPages.value = response.totalPages
    lastFilters.value = filters || null

    loading.value = false
  }

  watch(search, () => {
    fetchProducts({ cache: 'no-cache' })
    currentPage.value = 1
  })
  watch(currentPage, () => fetchProducts({ cache: 'no-cache' }))

  onMounted(() => fetchProducts({ cache: 'no-cache' }))

  return {
    products,
    loading,
    update: fetchProducts,
    currentPage,
    totalPages,
    onChangePage,
  }
}
