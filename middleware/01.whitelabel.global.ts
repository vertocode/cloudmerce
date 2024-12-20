export default defineNuxtRouteMiddleware(async () => {
  const { getWhitelabel } = useWhitelabel()
  const whitelabel = await getWhitelabel()

  if (!whitelabel) {
    console.warn('Não foi encontrado uma whitelabel para a loja')
    return navigateTo('/whitelabel-configuration')
  }
})
