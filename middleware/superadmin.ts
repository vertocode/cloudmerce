export default defineNuxtRouteMiddleware((to, from) => {
  const { isSuperAdmin, isLoggedIn } = useUser()

  // If not logged in, redirect to home
  if (!isLoggedIn.value) {
    return navigateTo('/')
  }

  // If not superadmin, redirect to home or admin depending on role
  if (!isSuperAdmin.value) {
    const { isAdmin } = useUser()
    if (isAdmin.value) {
      return navigateTo('/admin')
    }
    return navigateTo('/')
  }
})
