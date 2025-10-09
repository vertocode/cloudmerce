import type { IPage, IPageFormData } from '~/types/page'

export const usePages = () => {
  const pages = useState<IPage[]>('pages', () => [])
  const loading = ref(false)

  const { get, post, put, remove } = useApi()

  const fetchPages = async () => {
    const { whitelabel } = useWhitelabel()

    try {
      loading.value = true
      const response = await get(`/pages/ecommerce/${whitelabel.value._id}`) as IPage[]
      pages.value = response
    } catch (error) {
      console.error('Error fetching pages:', error)
      pages.value = []
    } finally {
      loading.value = false
    }
  }

  const getPageById = async (pageId: string): Promise<IPage | null> => {
    const { whitelabel } = useWhitelabel()

    try {
      const response = await get(`/pages/${whitelabel.value._id}/${pageId}`) as IPage
      return response
    } catch (error) {
      console.error('Error fetching page:', error)
      return null
    }
  }

  const getPageByHandle = async (handle: string): Promise<IPage | null> => {
    const { whitelabel } = useWhitelabel()

    try {
      const response = await get(`/pages/handle/${whitelabel.value._id}/${handle}`) as IPage
      return response
    } catch (error) {
      console.error('Error fetching page by handle:', error)
      return null
    }
  }

  const createPage = async (data: IPageFormData) => {
    const { whitelabel } = useWhitelabel()

    try {
      loading.value = true
      const response = await post('/pages', {
        ...data,
        ecommerceId: whitelabel.value._id,
      }) as IPage

      pages.value.unshift(response)
      return response
    } catch (error: any) {
      console.error('Error creating page:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const updatePage = async (pageId: string, data: Partial<IPageFormData>) => {
    try {
      loading.value = true
      const response = await put(`/pages/${pageId}`, data) as IPage

      const index = pages.value.findIndex(p => p._id === pageId)
      if (index !== -1) {
        pages.value[index] = response
      }

      return response
    } catch (error: any) {
      console.error('Error updating page:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const deletePage = async (pageId: string) => {
    try {
      loading.value = true
      await remove(`/pages/${pageId}`)

      pages.value = pages.value.filter(p => p._id !== pageId)
    } catch (error: any) {
      console.error('Error deleting page:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  return {
    pages,
    loading,
    fetchPages,
    getPageById,
    getPageByHandle,
    createPage,
    updatePage,
    deletePage,
  }
}
