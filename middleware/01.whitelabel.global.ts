import type { IWhitelabel, IWhitelabelError } from '~/types/whitelabel'

export default defineNuxtRouteMiddleware(async (to) => {
  const whitelabelCache = useState<IWhitelabel | string | null>('whitelabel-cache', () => null)

  // Skip middleware for admin-setup page
  if (to.path === '/admin-setup') {
    return
  }

  // Load whitelabel data if not already loaded
  if ((!whitelabelCache.value || whitelabelCache.value === 'error') && !to.path.includes('/admin-setup')) {
    const url = useRequestURL()

    console.log('Fetching whitelabel in middleware for:', url.host)

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

    console.log('Whitelabel middleware result:', whitelabel.value)

    if ((whitelabel.value as IWhitelabelError)?.code === 404) {
      whitelabelCache.value = 'error'
      const storage = makeStorage()
      const userData = storage.getItem<{ role: string }>('userData')

      // If admin is accessing admin routes, allow despite missing whitelabel
      if (userData?.role === 'admin' && to.path.startsWith('/admin')) {
        console.log('[Whitelabel Middleware] Admin accessing admin route, allowing despite missing whitelabel')
        return
      }

      // Non-admin or non-admin route: redirect to setup
      console.log('No whitelabel found, redirecting to admin-setup')
      return navigateTo('/admin-setup')
    }

    whitelabelCache.value = whitelabel.value as IWhitelabel | string
  }

  if (whitelabelCache.value && whitelabelCache.value === 'error' && to.path !== '/error' && to.path !== '/admin-setup') {
    // Check if user is admin accessing admin routes
    const storage = makeStorage()
    const userData = storage.getItem<{ role: string }>('userData')
    console.log('[Whitelabel Middleware] Error state check:', {
      hasUserData: !!userData,
      role: userData?.role,
      isAdmin: userData?.role === 'admin',
      path: to.path,
    })

    if (userData?.role === 'admin' && to.path.startsWith('/admin')) {
      console.log('[Whitelabel Middleware] Admin accessing admin route, allowing despite error state')
      return
    }

    console.log('[Whitelabel Middleware] Non-admin or non-admin route, redirecting to /error')
    return navigateTo('/error')
  }

  if (!whitelabelCache.value && to.path !== '/admin-setup') {
    // Check if admin accessing admin routes
    const storage = makeStorage()
    const userData = storage.getItem<{ role: string }>('userData')

    if (userData?.role === 'admin' && to.path.startsWith('/admin')) {
      console.log('[Whitelabel Middleware] Admin accessing admin route, allowing despite no cache')
      return
    }

    return navigateTo('/admin-setup')
  }
})
