import type { User } from '~/types/user'

export default defineNuxtRouteMiddleware(() => {
  const storage = makeStorage()
  const userData = storage.getItem<User>('userData')

  if (!userData) {
    return navigateTo('/')
  }
})
