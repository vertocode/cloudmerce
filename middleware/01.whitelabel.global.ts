import type { IWhitelabel, IWhitelabelError } from '~/types/whitelabel'

export default defineNuxtRouteMiddleware(async (to) => {
  const whitelabelCache = useState<IWhitelabel | string | null>('whitelabel-cache', () => null)

  // Skip middleware for admin-setup page
  if (to.path === '/admin-setup') {
    return
  }

  // Skip middleware for admin routes if user is admin
  if (to.path.startsWith('/admin')) {
    const storage = makeStorage()
    const userData = storage.getItem<{ role: string }>('userData')
    console.log('[Whitelabel Middleware] Admin route check:', {
      path: to.path,
      hasUserData: !!userData,
      role: userData?.role,
      isAdmin: userData?.role === 'admin',
    })
    if (userData?.role === 'admin') {
      console.log('[Whitelabel Middleware] Admin accessing admin route, allowing access')
      return
    }
  }

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
      // Only redirect non-admins to setup
      const storage = makeStorage()
      const userData = storage.getItem<{ role: string }>('userData')
      if (userData?.role !== 'admin') {
        console.log('No whitelabel found, redirecting to admin-setup')
        return navigateTo('/admin-setup')
      }
      console.log('Admin user, allowing access despite missing whitelabel')
      return
    }

    whitelabelCache.value = whitelabel.value as IWhitelabel | string
  }

  if (whitelabelCache.value && whitelabelCache.value === 'error' && to.path !== '/error' && to.path !== '/admin-setup') {
    // Check if user is admin before redirecting to error
    const storage = makeStorage()
    const userData = storage.getItem<{ role: string }>('userData')
    console.log('[Whitelabel Middleware] Error state check:', {
      hasUserData: !!userData,
      role: userData?.role,
      isAdmin: userData?.role === 'admin',
    })
    if (userData?.role === 'admin') {
      console.log('[Whitelabel Middleware] Admin user, allowing access despite error state')
      return
    }
    console.log('[Whitelabel Middleware] Non-admin user, redirecting to /error')
    return navigateTo('/error')
  }

  if (!whitelabelCache && to.path !== '/admin-setup') {
    return navigateTo('/admin-setup')
  }
})
