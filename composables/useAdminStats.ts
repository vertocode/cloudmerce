export interface IAdminStats {
  productCount: number
  productTypeCount: number
  orderCount: number
}

export const useAdminStats = () => {
  const stats = useState<IAdminStats | null>('adminStats', () => null)
  const loading = ref(false)
  const { get } = useApi()

  const fetchStats = async () => {
    const { whitelabel } = useWhitelabel()

    if (!whitelabel.value?._id) {
      console.error('No whitelabel ID available')
      stats.value = null
      return
    }

    try {
      loading.value = true
      // Ensure the whitelabel ID is converted to string
      const ecommerceId = String(whitelabel.value._id)
      console.log('[useAdminStats] Fetching stats for ecommerceId:', ecommerceId)
      const response = await get(`/admin/stats/${ecommerceId}`) as IAdminStats
      console.log('[useAdminStats] Stats received:', response)
      stats.value = response
    } catch (error) {
      console.error('Error fetching admin stats:', error)
      stats.value = null
    } finally {
      loading.value = false
    }
  }

  return {
    stats,
    loading,
    fetchStats,
  }
}
