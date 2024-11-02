export interface IProductType {
    id: string
    name: string
}

interface IProductTypeResponse {
    _id: string
    name: string
    createdAt: string
    updatedAt: string
    ecommerceId: string
}

export const useStoreData = () => {
    const { get } = useApi()
    const ecommerceId = 1
    const productTypes = useState<IProductType[]>(() => [])

    interface IUpdateProductTypes {
        cache?: 'no-cache' | 'force-cache'
    }

    const updateProductTypes = async ({ cache }: IUpdateProductTypes) => {
        try {
            if (productTypes.value.length && cache !== 'no-cache') return

            const response = await get(`/product-types/ecommerce/${ecommerceId}`, {}, {
                cache: cache || 'force-cache'
            }) as IProductTypeResponse[]
            productTypes.value = response.map((productType: IProductTypeResponse) => ({
                id: productType?._id,
                name: productType.name
            }))
        } catch (e) {
            console.error(e)
        }
    }

    callOnce('updateProductTypes', () => updateProductTypes({ cache: 'force-cache' }))

    const storeName = 'Cloudmerce'
    const storeLogo = 'https://i.imgur.com/wtfyizY.png'
    const storeDescription = "Aqui na nossa loja, você encontrará uma seleção cuidadosa de produtos que refletem qualidade, estilo e inovação. Trabalhamos diariamente para trazer o que há de melhor no mercado, oferecendo um atendimento dedicado e uma experiência de compra que prioriza a sua satisfação."
    const storeSocialMedia = [
        {
            name: 'WhatsApp',
            url: 'https://wa.me/5535992712327',
            icon: 'mdi-whatsapp'
        },
        {
            name: 'Instagram',
            url: 'https://www.instagram.com/verto.js',
            icon: 'mdi-instagram'
        },
        {
            name: 'Facebook',
            url: 'https://www.facebook.com/Everto.V',
            icon: 'mdi-facebook'
        },
        {
            name: 'Twitter',
            url: 'https://x.com/vertostucks',
            icon: 'mdi-twitter'
        }
    ]

    const getProductTypeById = (id: string) => {
        return productTypes.value.find(productType => productType.id === id)
    }

    return {
        ecommerceId,
        productTypes,
        storeName,
        storeDescription,
        storeLogo,
        storeSocialMedia,
        getProductTypeById,
        updateProductTypes: updateProductTypes
    }
}
