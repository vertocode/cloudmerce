const omit = (obj: any, keys: string[]) => {
  return Object.fromEntries(Object.entries(obj).filter(([key]) => !keys.includes(key)))
}

export const useApi = () => {
  const config = useRuntimeConfig()
  const apiUrl = config.public?.apiUrl || console.error('API URL not found in runtime config.')

  // Get token from storage
  const getAuthToken = () => {
    const storage = makeStorage()
    const userData = storage.getItem<{ token?: string }>('userData')
    return userData?.token || null
  }

  const commonHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  }

  const getHeadersWithAuth = (additionalHeaders?: HeadersInit) => {
    const token = getAuthToken()
    return {
      ...commonHeaders,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...additionalHeaders,
    }
  }

  const clearCacheKey = async (key: string) => {
    if (import.meta.client) {
      try {
        await $fetch(`/api/__cache__/${key}`, { method: 'DELETE' })
      } catch (error) {
        console.warn(`Failed to clear cache for key: ${key}`, error)
      }
    }
  }

  const clearProductsCache = async (ecommerceId: string) => {
    if (import.meta.client) {
      try {
        await $fetch(`/api/__cache__/products/${ecommerceId}`, { method: 'DELETE' })
      } catch (error) {
        console.warn(`Failed to clear products cache for ecommerce: ${ecommerceId}`, error)
      }
    }
  }

  const clearProductTypesCache = async (ecommerceId: string) => {
    if (import.meta.client) {
      try {
        await $fetch(`/api/__cache__/product-types/${ecommerceId}`, { method: 'DELETE' })
      } catch (error) {
        console.warn(`Failed to clear product-types cache for ecommerce: ${ecommerceId}`, error)
      }
    }
  }

  const clearAllCache = async () => {
    if (import.meta.client) {
      try {
        await $fetch('/api/__cache__/clear-all', { method: 'POST' })
      } catch (error) {
        console.warn('Failed to clear all cache', error)
      }
    }
  }

  const get = async (path: string, data?: Record<string, any>, options?: { cache?: 'no-cache' | 'force-cache' }, headers?: HeadersInit) => {
    const query = data ? new URLSearchParams(data).toString() : ''

    return $fetch(`${apiUrl}${path}?${query}`, {
      method: 'GET',
      headers: getHeadersWithAuth(headers),
      ...options,
    })
  }

  const post = async (path: string, data: unknown, { useFormData }: { useFormData: boolean } = { useFormData: false }) => {
    const token = getAuthToken()
    return $fetch(`${apiUrl}${path}`, {
      method: 'POST',
      body: useFormData ? data || '' : JSON.stringify(data),
      headers: {
        ...(useFormData ? {} : commonHeaders),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })
  }

  const patch = async (path: string, data: unknown) => {
    return $fetch(`${apiUrl}${path}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
      headers: getHeadersWithAuth(),
    })
  }

  const put = async (path: string, data: unknown) => {
    return $fetch(`${apiUrl}${path}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: getHeadersWithAuth(),
    })
  }

  const remove = async (path: string) => {
    return $fetch(`${apiUrl}${path}`, {
      method: 'DELETE',
      headers: getHeadersWithAuth(),
    })
  }

  return {
    get,
    post,
    patch,
    remove,
    put,
    clearCacheKey,
    clearProductsCache,
    clearProductTypesCache,
    clearAllCache,
  }
}
