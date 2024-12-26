export default defineNuxtRouteMiddleware(async (to) => {
  const { getWhitelabel } = useWhitelabel()
  const whitelabel = await getWhitelabel()

  if (!whitelabel && to.path !== '/whitelabel-configuration') {
    console.warn('Não foi encontrado uma whitelabel para a loja')
    return navigateTo('/whitelabel-configuration')
  }
})
