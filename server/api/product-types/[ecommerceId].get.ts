export default cachedEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const apiUrl = config.public?.apiUrl
  const ecommerceId = getRouterParam(event, 'ecommerceId')

  const url = `${apiUrl}/product-types/ecommerce/${ecommerceId}`

  const response = await $fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  return response
}, {
  maxAge: 60 * 60 * 24, // 24 hours
  getKey: (event) => `product-types-${getRouterParam(event, 'ecommerceId')}`,
})