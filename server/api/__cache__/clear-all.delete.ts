export default defineEventHandler(async (event) => {
  try {
    const storage = useStorage('cache')
    const keys = await storage.getKeys()

    // Clear all cache keys
    await Promise.all(keys.map(key => storage.removeItem(key)))

    return {
      success: true,
      message: `Cleared ${keys.length} cache entries`,
      clearedKeys: keys,
    }
  } catch (error) {
    console.error('Error clearing all caches:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to clear all caches',
    })
  }
})
