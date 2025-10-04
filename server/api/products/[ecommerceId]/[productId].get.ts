export default cachedEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const apiUrl = config.public?.apiUrl
  const ecommerceId = getRouterParam(event, 'ecommerceId')
  const productId = getRouterParam(event, 'productId')

  const url = `${apiUrl}/products/${ecommerceId}/${productId}`

  const response = await $fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  return response
}, {
  maxAge: 60 * 60 * 24, // 24 hours
  getKey: (event) => {
    const ecommerceId = getRouterParam(event, 'ecommerceId')
    const productId = getRouterParam(event, 'productId')
    return `product-${ecommerceId}-${productId}`
  },
})