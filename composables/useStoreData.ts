export const useStoreData = () => {
  const ecommerceId = 1

  const storeName = 'Cloudmerce'
  const storeLogo = 'https://i.imgur.com/wtfyizY.png'
  const storeDescription = 'Aqui na nossa loja, você encontrará uma seleção cuidadosa de produtos que refletem qualidade, estilo e inovação. Trabalhamos diariamente para trazer o que há de melhor no mercado, oferecendo um atendimento dedicado e uma experiência de compra que prioriza a sua satisfação.'
  const storeSocialMedia = [
    {
      name: 'WhatsApp',
      url: 'https://wa.me/5535992712327',
      icon: 'mdi-whatsapp',
    },
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/verto.js',
      icon: 'mdi-instagram',
    },
    {
      name: 'Facebook',
      url: 'https://www.facebook.com/Everto.V',
      icon: 'mdi-facebook',
    },
    {
      name: 'Twitter',
      url: 'https://x.com/vertostucks',
      icon: 'mdi-twitter',
    },
  ]

  return {
    ecommerceId,
    storeName,
    storeDescription,
    storeLogo,
    storeSocialMedia,
  }
}
