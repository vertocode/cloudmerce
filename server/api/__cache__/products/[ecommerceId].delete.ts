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

    // Filter keys that match products for this ecommerce
    const productKeys = keys.filter(key =>
      key.includes(`products-${ecommerceId}`) ||
      key.includes(`product-${ecommerceId}`)
    )

    // Remove all matching keys
    await Promise.all(productKeys.map(key => storage.removeItem(key)))

    return {
      success: true,
      message: `Cleared ${productKeys.length} product cache entries for ecommerce ${ecommerceId}`,
      keys: productKeys,
    }
  } catch (error) {
    console.error('Error clearing product cache:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to clear product cache',
    })
  }
})
