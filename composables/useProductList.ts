import type { IGetProductsResponse, IProduct, IProductFilters, IProductResponse } from '~/types/product'
import { shouldRevalidateProducts, clearProductsRevalidation } from '~/utils/revalidation'

export const useProductList = (filters?: IProductFilters, options?: { disableWatchers?: boolean }) => {
  const products = useState<IProduct[]>('products', () => [])
  const lastFilters = useState<IProductFilters | null>(() => null)
  const loading = useState<boolean>(() => false)
  const search = useState<string>('filterSearchProducts', () => '')
  const currentPage = ref(1)
  const totalPages = ref(1)
  const totalItems = ref(0)

  const onChangePage = (page: number) => {
    currentPage.value = page
  }

  const { get } = useApi()

  interface IFetchProducts {
    cache?: 'force-cache' | 'no-cache'
    limit?: number
    search?: string
  }
  const fetchProducts = async ({ cache, limit, search: searchParam }: IFetchProducts = {}) => {
    const prevFilters = lastFilters.value

    // Check if products need revalidation from localStorage
    const needsRevalidation = shouldRevalidateProducts()
    const forceNoCache = cache === 'no-cache' || needsRevalidation

    // Update internal search if provided
    if (searchParam !== undefined) {
      search.value = searchParam
    }

    // If we already have the products, and don't have the filters or the filters are the same as the previous ones, we don't need to fetch the products again
    if (products.value.length && !filters && !prevFilters && !forceNoCache && limit === undefined && searchParam === undefined) {
      return
    }

    // If the filters are the same as the previous ones, we don't need to fetch the products again
    if (filters && prevFilters?.productType === filters.productType && prevFilters?.search === filters.search && !forceNoCache && limit === undefined && searchParam === undefined) {
      return
    }

    const { whitelabel } = useWhitelabel()

    loading.value = true
    const response = await $fetch(`/api/products/${whitelabel.value._id}`, {
      query: {
        ...filters,
        search: search.value || '',
        limit: limit || 12,
        page: currentPage.value,
        ...(forceNoCache ? { t: Date.now() } : {}),
      },
    }) as IGetProductsResponse

    // If response is empty and we're using cache, try revalidating once
    if (response.products.length === 0 && !forceNoCache && !filters && !search.value) {
      console.log('[useProductList] Empty response from cache, revalidating...')
      const revalidatedResponse = await $fetch(`/api/products/${whitelabel.value._id}`, {
        query: {
          ...filters,
          search: search.value || '',
          limit: limit || 12,
          page: currentPage.value,
          t: Date.now(),
        },
      }) as IGetProductsResponse

      products.value = revalidatedResponse.products.map((product: IProductResponse): IProduct => ({
        id: product._id,
        name: product.name,
        image: product.image,
        description: product.description,
        price: product.price,
        productType: product.productType,
        fields: product.fields,
        stock: product.stock,
      }))
      totalPages.value = revalidatedResponse.totalPages
      totalItems.value = revalidatedResponse.totalItems
      lastFilters.value = filters || null
      loading.value = false

      // Clear revalidation flag after successful fetch
      if (needsRevalidation) {
        clearProductsRevalidation()
      }
      return
    }

    products.value = response.products.map((product: IProductResponse): IProduct => ({
      id: product._id,
      name: product.name,
      image: product.image,
      description: product.description,
      price: product.price,
      productType: product.productType,
      fields: product.fields,
      stock: product.stock,
    }))
    totalPages.value = response.totalPages
    totalItems.value = response.totalItems
    lastFilters.value = filters || null

    // Clear revalidation flag after successful fetch
    if (needsRevalidation) {
      clearProductsRevalidation()
    }

    loading.value = false
  }

  // Only enable watchers if not disabled (for admin pages with custom controls)
  if (!options?.disableWatchers) {
    watch(search, () => {
      fetchProducts({ cache: 'no-cache' })
      currentPage.value = 1
    })
    watch(currentPage, () => fetchProducts({ cache: 'no-cache' }))

    // Use cache on initial mount to prevent duplicate requests
    onMounted(() => fetchProducts())
  }

  return {
    products,
    loading,
    update: fetchProducts,
    currentPage,
    totalPages,
    totalItems,
    onChangePage,
  }
}
