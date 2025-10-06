export default defineEventHandler(async (event) => {
  const key = getRouterParam(event, 'key')

  if (!key) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Cache key is required',
    })
  }

  try {
    const storage = useStorage('cache')
    await storage.removeItem(key)

    return {
      success: true,
      message: `Cache cleared for key: ${key}`,
    }
  } catch (error) {
    console.error('Error clearing cache:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to clear cache',
    })
  }
})
