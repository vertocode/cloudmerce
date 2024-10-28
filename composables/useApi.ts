export const useApi = () => {
    const config = useRuntimeConfig()
    const apiUrl = config.public?.apiUrl || console.error('API URL not found in runtime config.')

    const get = async (path: string) => {
        return $fetch(`${apiUrl}${path}`)
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
