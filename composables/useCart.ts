export const useCart = () => {
    const cart = ref([])

    const addToCart = (item) => {
        cart.value.push(item)
    }
    const removeFromCart = (index) => {
        cart.value.splice(index, 1)
    }

    return { cart, addToCart, removeFromCart }
}
