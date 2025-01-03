export default defineNuxtRouteMiddleware(async (to) => {
  const { getWhitelabel } = useWhitelabel()
  const whitelabel = await getWhitelabel()

  if (whitelabel === 'error' && to.path !== '/error') {
    return navigateTo('/error')
  }

  if (!whitelabel && to.path !== '/whitelabel-configuration') {
    return navigateTo('/whitelabel-configuration')
  }
})
