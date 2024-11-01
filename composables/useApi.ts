export const useApi = () => {
    const config = useRuntimeConfig()
    const apiUrl = config.public?.apiUrl || console.error('API URL not found in runtime config.')

    const get = async (path: string, data: Record<string, any>, options?: { cache?: 'no-cache' | 'force-cache' }) => {
        const query = new URLSearchParams(data).toString()

        return $fetch(`${apiUrl}${path}?${query}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            ...options
        })
    }

    const post = async (path: string, data: any) => {
        return $fetch(`${apiUrl}${path}`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }

    const patch = async (path: string, data: any) => {
        return $fetch(`${apiUrl}${path}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }

    return {
        get,
        post,
        patch
    }
}
