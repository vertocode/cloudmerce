import type { User } from '~/types/user'

export default defineNuxtRouteMiddleware(() => {
  const storage = makeStorage()
  const userData = storage.getItem<User>('userData')
  const isAdminOrSuperAdmin = userData?.role === 'admin' || userData?.role === 'superadmin'

  if (!userData || !isAdminOrSuperAdmin) {
    return navigateTo('/')
  }
})
