export default defineEventHandler(async (event) => {
  try {
    const storage = useStorage('cache')

    // Get all cache keys
    const keys = await storage.getKeys()

    // Remove all keys
    await Promise.all(keys.map(key => storage.removeItem(key)))

    return {
      success: true,
      message: `Cleared all cache entries (${keys.length} total)`,
      keys,
    }
  } catch (error) {
    console.error('Error clearing all cache:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to clear all cache',
    })
  }
})
