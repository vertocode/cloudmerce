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
    const productTypes = ref<IProductType[]>([])

    onMounted(async () => {
        try {
            const response = await get(`/product-types/ecommerce/${ecommerceId}`, {}) as IProductTypeResponse[]
            productTypes.value = response.map((productType: IProductTypeResponse) => ({
                id: productType?._id,
                name: productType.name
            }))
        } catch (e) {
            console.error(e)
        }
    })

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

    return {
        ecommerceId,
        productTypes,
        storeName,
        storeDescription,
        storeLogo,
        storeSocialMedia
    }
}
