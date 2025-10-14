import type { IWhitelabel } from '~/types/whitelabel'

export default defineNuxtRouteMiddleware((to) => {
  console.log('[Setup Guard Middleware] Running for path:', to.path)

  // Skip for admin-setup page
  if (to.path === '/admin-setup') {
    console.log('[Setup Guard Middleware] Skipping for admin-setup page')
    return
  }

  // Skip for admin routes (allow admin to access admin panel)
  if (to.path.startsWith('/admin')) {
    console.log('[Setup Guard Middleware] Skipping for admin routes')
    return
  }

  const whitelabelCache = useState<IWhitelabel | string | null>('whitelabel-cache')
  const storage = makeStorage()
  const userData = storage.getItem<{ role: string }>('userData')

  const isAdminOrSuperAdmin = userData?.role === 'admin' || userData?.role === 'superadmin'

  console.log('[Setup Guard Middleware] User data check:', {
    hasUserData: !!userData,
    role: userData?.role,
    isAdmin: isAdminOrSuperAdmin,
  })

  // If whitelabel is not configured (error state)
  if (whitelabelCache.value === 'error') {
    // Only allow admin/superadmin users to proceed
    if (!isAdminOrSuperAdmin) {
      // Non-admin users should see the admin-setup page
      return navigateTo('/admin-setup')
    }
  }

  // Check if whitelabel exists and is active
  if (whitelabelCache.value && typeof whitelabelCache.value === 'object') {
    const whitelabel = whitelabelCache.value as IWhitelabel

    // If whitelabel is inactive, only admin/superadmin can access
    if (whitelabel.isActive === false && !isAdminOrSuperAdmin) {
      return navigateTo('/admin-setup')
    }

    // Check if whitelabel has required fields configured
    const hasRequiredFields = whitelabel.name && whitelabel.primaryColor && whitelabel.secondaryColor

    // If required fields are not filled, only admin/superadmin can access
    if (!hasRequiredFields && !isAdminOrSuperAdmin) {
      return navigateTo('/admin-setup')
    }
  }
})
