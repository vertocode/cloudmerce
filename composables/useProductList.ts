import type { IProduct, IProductFilters } from "~/types/product";

export const useProductList = (filters?: IProductFilters) => {
    const products = useState<IProduct[]>(() => [])
    const lastFilters = useState<IProductFilters | null>(() => null)

    const { ecommerceId } = useStoreData()
    const { get } = useApi()

    interface IFetchProducts {
        cache?: 'force-cache' | 'no-cache'
    }
    const fetchProducts = async ({ cache }: IFetchProducts = {}) => {
        const prevFilters = lastFilters.value

        // If we already have the products, and don't have the filters or the filters are the same as the previous ones, we don't need to fetch the products again
        if (products.value.length && !filters && !prevFilters && cache !== 'no-cache') return

        // If the filters are the same as the previous ones, we don't need to fetch the products again
        if (filters && prevFilters?.productType === filters.productType && prevFilters?.search === filters.search && cache !== 'no-cache') return

        products.value = await get(`/products/ecommerce/${ecommerceId}`, filters || {}, {
            cache: cache || 'force-cache'
        }) as IProduct[]
        lastFilters.value = filters || null
    }

    onMounted(() => fetchProducts({ cache: 'no-cache' }))

    return {
        products,
        update: fetchProducts
    }
}
