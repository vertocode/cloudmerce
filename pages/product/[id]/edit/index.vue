<template>
  <div class="edit-product">
    <header>
      <VIcon @click="$router.back()">
        mdi-arrow-left
      </VIcon>
      <h1>Editar produto</h1>
    </header>
    <MdProductForm
      :on-register-new-product-type="onRegisterNewProductType"
      :on-close="onClose"
      :action="updateProduct"
      :initial-values="initialValues"
      :old-image-urls="Array.isArray(product.image) ? product.image : [product.image]"
    />
  </div>
</template>

<script setup lang="ts">
import { StockOptions } from '~/components/Md/ProductForm/types/stock'

const { getProductById } = useProduct({})

const route = useRoute()

const product = await getProductById(route.params.id as string, { cache: 'no-cache' })

const onRegisterNewProductType = () => {
  const router = useRouter()
  router.push('/product-type')
}

const onClose = () => {
  const router = useRouter()
  router.push('/')
}

if (!product) {
  handleError('Produto não encontrado')
  throw new Error('Product not found')
}

const imageFiles = Array.isArray(product.image)
  ? await Promise.all(product.image.map(async (image, imgIdx) => {
    return convertUrlToFile(image as string, `product-image-${imgIdx}`)
  }))
  : [product.image]

const initialValues = computed(() => {
  const { getProductTypeById } = useProductTypes()
  if (!product) return {}

  return {
    productName: product.name || '',
    productType: getProductTypeById(product.productType)?.name || '',
    imageFiles,
    productDescription: product.description || '',
    productPrice: product.price || 0,
    stockOption: product.stock?.type || StockOptions.UNLIMITED,
    stockQuantity: product.stock?.quantity || null,
    userFields: product.fields.map(field => {
      // Convert old string format to new object format
      let options = field.options || []
      if (options.length > 0 && typeof options[0] === 'string') {
        // Old format: array of strings
        options = options.map((opt: string) => ({
          name: opt,
          hex: '',
          image: null,
        }))
      }

      return {
        ...field,
        type: getFieldLabel(field.type),
        options,
      }
    }) || [],
  }
})

const updateProduct = async (values: Record<string, any>) => {
  if (!product) {
    throw new Error('Produto não encontrado')
  }

  const { put, clearCacheKey } = useApi()
  await put(`/products/${product.id}`, {
    ecommerceId: values.ecommerceId,
    name: values.productName,
    price: values.productPrice,
    description: values.productDescription,
    productType: values.productType,
    image: values.imageUrls,
    fields: values.userFields,
    stock: {
      type: values.stockOption,
      quantity: values.stockQuantity,
    },
  })

  // Clear products list cache for this ecommerce
  await clearCacheKey(`products-${values.ecommerceId}-{}`)

  // Clear individual product cache
  await clearCacheKey(`product-${values.ecommerceId}-${product.id}`)

  // Force refresh products list in the state
  const products = useState<any[]>('products', () => [])
  products.value = []

  // Mark products for revalidation using localStorage
  const { markProductsForRevalidation, markProductIdsForRevalidation } = await import('~/utils/revalidation')
  markProductsForRevalidation()
  markProductIdsForRevalidation([product.id])

  handleSuccess('Produto atualizado com sucesso!')
}
</script>

<style scoped lang="scss">
.edit-product {
  padding: 24px 0;

  header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 24px;

    h1 {
      font-size: 1.5rem;
    }

    .v-icon {
      cursor: pointer;
    }

    @media (max-width: $mobile-breakpoint) {
      h1 {
        font-size: 1.2rem;
      }
    }
  }
}
</style>
