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
  maxAge: 60 * 60 * 24 * 365, // 1 year (effectively forever)
  getKey: (event) => {
    const ecommerceId = getRouterParam(event, 'ecommerceId')
    const productId = getRouterParam(event, 'productId')
    const query = getQuery(event)
    // If timestamp query param exists, include it in the key to bypass cache
    const cacheKey = query.t ? `product-${ecommerceId}-${productId}-${query.t}` : `product-${ecommerceId}-${productId}`
    return cacheKey
  },
})