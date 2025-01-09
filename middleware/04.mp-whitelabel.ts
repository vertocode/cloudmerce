export default defineNuxtRouteMiddleware(async (to) => {
  const { whitelabel } = useWhitelabel()

  if (whitelabel.value.hasMP && to.path === '/mp-oauth-confirmation') {
    return navigateTo('/')
  }
})
