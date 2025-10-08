export default cachedEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const apiUrl = config.public?.apiUrl
  const ecommerceId = getRouterParam(event, 'ecommerceId')
  const query = getQuery(event)

  const queryString = new URLSearchParams(query as Record<string, string>).toString()
  const url = `${apiUrl}/products/ecommerce/${ecommerceId}${queryString ? `?${queryString}` : ''}`

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
    const query = getQuery(event)
    // Include query params in cache key for proper cache segmentation
    return `products-${ecommerceId}-${JSON.stringify(query)}`
  },
})