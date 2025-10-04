export default cachedEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const apiUrl = config.public?.apiUrl
  const host = getRouterParam(event, 'host')

  const url = `${apiUrl}/whitelabel/${host}`

  const response = await $fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  return response
}, {
  maxAge: 60 * 60 * 24, // 24 hours
  getKey: (event) => `whitelabel-${getRouterParam(event, 'host')}`,
})