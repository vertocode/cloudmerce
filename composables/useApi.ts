const omit = (obj: any, keys: string[]) => {
  return Object.fromEntries(Object.entries(obj).filter(([key]) => !keys.includes(key)))
}

export const useApi = () => {
  const config = useRuntimeConfig()
  const apiUrl = config.public?.apiUrl || console.error('API URL not found in runtime config.')

  const commonHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  }

  const get = async (path: string, data?: Record<string, any>, options?: { cache?: 'no-cache' | 'force-cache' }, headers?: HeadersInit) => {
    const query = data ? new URLSearchParams(data).toString() : ''

    return $fetch(`${apiUrl}${path}?${query}`, {
      method: 'GET',
      headers: {
        ...commonHeaders,
        ...headers,
      },
      ...options,
    })
  }

  const post = async (path: string, data: unknown, { useFormData }: { useFormData: boolean } = { useFormData: false }) => {
    return $fetch(`${apiUrl}${path}`, {
      method: 'POST',
      body: useFormData ? data || '' : JSON.stringify(data),
      headers: {
        ...(useFormData ? {} : commonHeaders),
      },
    })
  }

  const patch = async (path: string, data: unknown) => {
    return $fetch(`${apiUrl}${path}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
      headers: {
        ...commonHeaders,
      },
    })
  }

  const put = async (path: string, data: unknown) => {
    return $fetch(`${apiUrl}${path}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        ...commonHeaders,
      },
    })
  }

  const remove = async (path: string) => {
    return $fetch(`${apiUrl}${path}`, {
      method: 'DELETE',
      headers: {
        ...commonHeaders,
      },
    })
  }

  return {
    get,
    post,
    patch,
    remove,
    put,
  }
}
