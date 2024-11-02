export const useApi = () => {
    const config = useRuntimeConfig()
    const apiUrl = config.public?.apiUrl || console.error('API URL not found in runtime config.')

    const commonHeaders = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    }

    const get = async (path: string, data: Record<string, any>, options?: { cache?: 'no-cache' | 'force-cache' }) => {
        const query = new URLSearchParams(data).toString()

        return $fetch(`${apiUrl}${path}?${query}`, {
            method: 'GET',
            headers: {
                ...commonHeaders
            },
            ...options
        })
    }

    const post = async (path: string, data: any) => {
        return $fetch(`${apiUrl}${path}`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
               ...commonHeaders
            }
        })
    }

    const patch = async (path: string, data: any) => {
        return $fetch(`${apiUrl}${path}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
            headers: {
                ...commonHeaders
            }
        })
    }

    const remove = async (path: string) => {
        return $fetch(`${apiUrl}${path}`, {
            method: 'DELETE',
            headers: {
                ...commonHeaders
            }
        })
    }

    return {
        get,
        post,
        patch,
        remove
    }
}
