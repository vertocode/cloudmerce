import type {IProduct} from "~/types/product";

export const useCart = () => {
    const cart = useState<IProduct[]>('cartProducts', () => [])
    const loading = ref<boolean>(false)

    const addToCart = async (item: IProduct) => {
        cart.value.push(item)
    }
    const removeFromCart = (id: string) => {
        cart.value = cart.value.filter((item) => item.id !== id)
    }

    return { cart, loading, addToCart, removeFromCart }
}
