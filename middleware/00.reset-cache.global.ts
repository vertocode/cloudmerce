export default defineNuxtRouteMiddleware(async (to) => {
  // Check if resetCache query parameter is present and true
  if (to.query.resetCache === 'true') {
    try {
      // Clear all caches via API endpoint
      await $fetch('/api/__cache__/clear-all', { method: 'DELETE' })

      console.log('All caches cleared successfully')

      // Remove resetCache from URL and redirect to clean URL
      const newQuery = { ...to.query }
      delete newQuery.resetCache

      return navigateTo({
        path: to.path,
        query: newQuery,
      }, { replace: true })
    } catch (error) {
      console.error('Failed to clear caches:', error)
    }
  }
})
