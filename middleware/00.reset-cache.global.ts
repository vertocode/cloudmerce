export default defineNuxtRouteMiddleware(async (to) => {
  const url = useRequestURL()
  const cacheParamsToRemove: string[] = []

  try {
    // Check for specific cache reset parameters
    if (to.query.resetHomepageCache === 'true') {
      console.log('Resetting homepage cache...')
      await $fetch(`/api/__cache__/whitelabel-${url.host}`, { method: 'DELETE' })
      console.log('Homepage cache cleared successfully')
      cacheParamsToRemove.push('resetHomepageCache')
    }

    if (to.query.resetWhitelabelCache === 'true') {
      console.log('Resetting whitelabel cache...')
      await $fetch(`/api/__cache__/whitelabel-${url.host}`, { method: 'DELETE' })
      console.log('Whitelabel cache cleared successfully')
      cacheParamsToRemove.push('resetWhitelabelCache')
    }

    if (to.query.resetProductsCache === 'true') {
      console.log('Resetting products cache...')
      // Extract ecommerce ID from whitelabel or use a default method
      const { whitelabel } = useWhitelabel()
      if (whitelabel.value?._id) {
        await $fetch(`/api/__cache__/products/${whitelabel.value._id}`, { method: 'DELETE' })
        console.log('Products cache cleared successfully')
      }
      cacheParamsToRemove.push('resetProductsCache')
    }

    if (to.query.resetPagesCache === 'true') {
      console.log('Resetting pages cache...')
      const { whitelabel } = useWhitelabel()
      if (whitelabel.value?._id) {
        await $fetch(`/api/__cache__/pages/${whitelabel.value._id}`, { method: 'DELETE' })
        console.log('Pages cache cleared successfully')
      }
      cacheParamsToRemove.push('resetPagesCache')
    }

    // Check if resetCache query parameter is present (clears everything)
    if (to.query.resetCache === 'true') {
      console.log('Resetting all caches...')
      await $fetch('/api/__cache__/clear-all', { method: 'DELETE' })
      console.log('All caches cleared successfully')
      cacheParamsToRemove.push('resetCache')
    }

    // Remove cache reset parameters from URL if any were processed
    if (cacheParamsToRemove.length > 0) {
      const newQuery = { ...to.query }
      cacheParamsToRemove.forEach(param => delete newQuery[param])

      return navigateTo({
        path: to.path,
        query: newQuery,
      }, { replace: true })
    }
  } catch (error) {
    console.error('Failed to clear caches:', error)
  }
})
