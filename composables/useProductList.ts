import type {IProduct, IProductFilters} from "~/types/product";

export const useProductList = (filters?: IProductFilters) => {
    const products = useState<IProduct[]>(() => [])

    const { ecommerceId } = useStoreData()
    const { get } = useApi()

    const fetchProducts = async () => {
        products.value = await get(`/products/ecommerce/${ecommerceId}`, {}) as IProduct[]
    }

    onMounted(fetchProducts)

    return {
        products,
        update: fetchProducts
    }
}
