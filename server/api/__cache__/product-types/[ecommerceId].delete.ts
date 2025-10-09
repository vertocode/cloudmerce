export default defineEventHandler(async (event) => {
  const ecommerceId = getRouterParam(event, 'ecommerceId')

  if (!ecommerceId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ecommerceId is required',
    })
  }

  try {
    const storage = useStorage('cache')

    // Get all cache keys
    const keys = await storage.getKeys()

    // Filter keys that match product-types for this ecommerce
    const productTypeKeys = keys.filter(key =>
      key.includes(`product-types-${ecommerceId}`)
    )

    // Remove all matching keys
    await Promise.all(productTypeKeys.map(key => storage.removeItem(key)))

    return {
      success: true,
      message: `Cleared ${productTypeKeys.length} product-type cache entries for ecommerce ${ecommerceId}`,
      keys: productTypeKeys,
    }
  } catch (error) {
    console.error('Error clearing product-type cache:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to clear product-type cache',
    })
  }
})
