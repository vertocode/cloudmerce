import type { IWhitelabel, IWhitelabelError } from '~/types/whitelabel'

export default defineNuxtRouteMiddleware(async (to) => {
  const whitelabelCache = useState<IWhitelabel | string | null>('whitelabel-cache', () => null)

  if ((!whitelabelCache.value || whitelabelCache.value === 'error') && !to.path.includes('/whitelabel-configuration')) {
    const url = useRequestURL()

    const { data: whitelabel } = await useAsyncData(
      `whitelabel-${url.host}`,
      () => $fetch(`/api/whitelabel/${url.host}`),
      {
        getCachedData: (key) => {
          const nuxtApp = useNuxtApp()
          const data = nuxtApp.payload.data[key] || nuxtApp.static.data[key]
          if (!data) return
          // Cache for 24 hours
          if (data.fetchedAt && Date.now() - data.fetchedAt < 24 * 60 * 60 * 1000) {
            return data
          }
        },
      },
    )

    if ((whitelabel.value as IWhitelabelError)?.code === 404) {
      whitelabelCache.value = 'error'
      return navigateTo('/whitelabel-configuration')
    }

    whitelabelCache.value = whitelabel.value as IWhitelabel | string
  }

  if (whitelabelCache.value && whitelabelCache.value === 'error' && to.path !== '/error' && to.path !== '/whitelabel-configuration') {
    return navigateTo('/error')
  }

  if (!whitelabelCache && to.path !== '/whitelabel-configuration') {
    return navigateTo('/whitelabel-configuration')
  }
})
