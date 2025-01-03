export default defineNuxtRouteMiddleware(async (to) => {
  const { getWhitelabel } = useWhitelabel()
  const whitelabel = await getWhitelabel({ cache: false })

  if (whitelabel?.hasMP && to.path === '/mp-oauth-confirmation') {
    return navigateTo('/')
  }
})
