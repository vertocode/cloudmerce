/**
 * Revalidation Manager
 * Uses localStorage to track what data needs to be revalidated after mutations
 */

const STORAGE_KEY = 'shouldRevalidate'

interface RevalidationState {
  products?: boolean
  productTypes?: boolean
  productIds?: string[]
  cart?: boolean
}

/**
 * Get current revalidation state from localStorage
 */
export function getRevalidationState(): RevalidationState {
  if (typeof window === 'undefined') return {}

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch (e) {
    console.error('Failed to read revalidation state:', e)
    return {}
  }
}

/**
 * Update revalidation state in localStorage
 */
export function setRevalidationState(state: RevalidationState): void {
  if (typeof window === 'undefined') return

  try {
    const current = getRevalidationState()
    const updated = { ...current, ...state }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  } catch (e) {
    console.error('Failed to set revalidation state:', e)
  }
}

/**
 * Mark products list for revalidation
 */
export function markProductsForRevalidation(): void {
  setRevalidationState({ products: true })
}

/**
 * Mark specific product IDs for revalidation
 */
export function markProductIdsForRevalidation(productIds: string[]): void {
  const current = getRevalidationState()
  const existingIds = current.productIds || []
  const uniqueIds = Array.from(new Set([...existingIds, ...productIds]))
  setRevalidationState({ productIds: uniqueIds })
}

/**
 * Mark product types for revalidation
 */
export function markProductTypesForRevalidation(): void {
  setRevalidationState({ productTypes: true })
}

/**
 * Mark cart for revalidation
 */
export function markCartForRevalidation(): void {
  setRevalidationState({ cart: true })
}

/**
 * Check if products list should revalidate
 */
export function shouldRevalidateProducts(): boolean {
  return getRevalidationState().products === true
}

/**
 * Check if a specific product should revalidate
 */
export function shouldRevalidateProduct(productId: string): boolean {
  const state = getRevalidationState()
  return state.products === true || (state.productIds || []).includes(productId)
}

/**
 * Check if product types should revalidate
 */
export function shouldRevalidateProductTypes(): boolean {
  return getRevalidationState().productTypes === true
}

/**
 * Check if cart should revalidate
 */
export function shouldRevalidateCart(): boolean {
  return getRevalidationState().cart === true
}

/**
 * Clear products revalidation flag
 */
export function clearProductsRevalidation(): void {
  const current = getRevalidationState()
  delete current.products
  delete current.productIds
  localStorage.setItem(STORAGE_KEY, JSON.stringify(current))
}

/**
 * Clear product types revalidation flag
 */
export function clearProductTypesRevalidation(): void {
  const current = getRevalidationState()
  delete current.productTypes
  localStorage.setItem(STORAGE_KEY, JSON.stringify(current))
}

/**
 * Clear cart revalidation flag
 */
export function clearCartRevalidation(): void {
  const current = getRevalidationState()
  delete current.cart
  localStorage.setItem(STORAGE_KEY, JSON.stringify(current))
}

/**
 * Clear all revalidation flags
 */
export function clearAllRevalidation(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEY)
}
