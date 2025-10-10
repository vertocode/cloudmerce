class StorageHelper {
  setItem(key: string, value: any): void {
    // Store in localStorage (client-side)
    if (import.meta.client) {
      localStorage.setItem(key, JSON.stringify(value))
    }

    // Also store in cookie for SSR compatibility
    // Nuxt's useCookie handles serialization automatically, so don't stringify
    try {
      const cookie = useCookie(key, {
        maxAge: 60 * 60 * 24 * 7, // 7 days
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      })
      cookie.value = value  // Don't stringify - useCookie handles it
      console.log(`[Storage] Stored ${key} in cookie:`, { hasValue: !!cookie.value })
    } catch (error) {
      console.warn(`[Storage] Failed to set cookie for ${key}:`, error)
    }
  }

  getItem<T>(key: string): T | null {
    // Try cookie first (works in SSR)
    // Nuxt's useCookie handles deserialization automatically
    try {
      const cookie = useCookie<T>(key)
      console.log(`[Storage] Reading ${key} from cookie:`, {
        hasValue: !!cookie.value,
        valueType: typeof cookie.value,
        role: cookie.value ? (cookie.value as any).role : 'no role',
      })
      if (cookie.value) {
        // useCookie already deserialized it, just return it
        return cookie.value as T
      }
    } catch (error) {
      console.warn(`[Storage] Failed to read cookie for ${key}:`, error)
    }

    // Fallback to localStorage (client-side only)
    if (import.meta.client) {
      const item = localStorage.getItem(key)
      if (item) {
        try {
          return JSON.parse(item) as T
        } catch {
          return null
        }
      }
    }
    return null
  }

  removeItem(key: string): void {
    if (import.meta.client) {
      localStorage.removeItem(key)
    }
    // Also remove from cookie
    try {
      const cookie = useCookie(key)
      cookie.value = null
    } catch (error) {
      console.warn(`[Storage] Failed to remove cookie for ${key}:`, error)
    }
  }
}

export default () => new StorageHelper()
