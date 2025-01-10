import type { IWhitelabel } from '~/types/whitelabel'

export default defineNuxtRouteMiddleware(async (to) => {
  const whitelabelCache = useState<IWhitelabel | string | null>('whitelabel-cache', () => null)

  if ((!whitelabelCache.value || whitelabelCache.value === 'error') && to.path !== 'whitelabel-configuration') {
    const { getWhitelabel } = useWhitelabel()
    const whitelabel = await getWhitelabel()

    whitelabelCache.value = whitelabel as IWhitelabel | string
  }

  if (whitelabelCache.value && whitelabelCache.value === 'error' && to.path !== '/error') {
    return navigateTo('/error')
  }

  if (!whitelabelCache && to.path !== '/whitelabel-configuration') {
    return navigateTo('/whitelabel-configuration')
  }
})
