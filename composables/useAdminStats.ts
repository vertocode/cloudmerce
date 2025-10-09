export interface IAdminStats {
  productCount: number
  productTypeCount: number
  orderCount: number
}

export const useAdminStats = () => {
  const stats = useState<IAdminStats | null>('adminStats', () => null)
  const loading = ref(false)

  const fetchStats = async () => {
    const { whitelabel } = useWhitelabel()

    try {
      loading.value = true
      const response = await $fetch(`/api/admin/stats/${whitelabel.value._id}`) as IAdminStats
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
