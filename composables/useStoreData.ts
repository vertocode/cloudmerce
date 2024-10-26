export const useStoreData = () => {
    const storeName = 'Cloudmerce'
    const productTypes = [
        'Camisetas', 'Blusas', 'Calças', 'Calçados', 'Acessórios',
        'Vestidos', 'Saias', 'Shorts', 'Jaquetas', 'Casacos',
        'Moletons', 'Roupas íntimas', 'Meias', 'Óculos', 'Bolsas',
        'Chapéus', 'Luvas', 'Cachecóis', 'Bijuterias', 'Relógios'
    ]
    const storeLogo = 'https://i.imgur.com/wtfyizY.png'
    const storeDescription = "Aqui na nossa loja, você encontrará uma seleção cuidadosa de produtos que refletem qualidade, estilo e inovação. Trabalhamos diariamente para trazer o que há de melhor no mercado, oferecendo um atendimento dedicado e uma experiência de compra que prioriza a sua satisfação."

    return {
        productTypes,
        storeName,
        storeDescription,
        storeLogo
    }
}
