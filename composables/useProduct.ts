import type {IProduct} from "~/types/product";

interface IUseProduct {
    product: IProduct
    updateProductList?: (param: { cache: 'no-cache' | 'force-cache' }) => Promise<void>
}

export const useProduct = ({ product, updateProductList }: IUseProduct) => {
    const loading = ref(false)

    const { post, remove } = useApi()

    const handleDelete = async () => {
        try {
            loading.value = true
            await remove(`/products/${product.id}`)
            handleSuccess(`Produto "${product.name}" deletado com sucesso!`)
            if (updateProductList) updateProductList({ cache: 'no-cache' })
        } catch (error) {
            console.error(error)
            handleError(`Erro ao deletar o produto "${product.name}"`)
        } finally {
            loading.value = false
        }
    }

    return {
        handleDelete,
        loading
    }
}
