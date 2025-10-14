<template>
  <div class="edit-product">
    <div class="page-header">
      <h1>Editar Produto</h1>
    </div>

    <MdProductForm
      v-if="product && initialValues"
      :initial-values="initialValues"
      :old-image-urls="product.image"
      :action="updateProduct"
      :on-register-new-product-type="onRegisterNewProductType"
    />
  </div>
</template>

<script setup lang="ts">
import type { IProduct } from '~/types/product'

definePageMeta({
  layout: 'admin',
  middleware: ['03-admin-auth'],
})

const route = useRoute()
const router = useRouter()
const productId = route.params.id as string

const product = ref<IProduct | null>(null)
const initialValues = ref<Record<string, any> | null>(null)
const { getProductById } = useProduct({})

const onRegisterNewProductType = () => {
  router.push('/admin/product-types')
}

const transformProductToFormValues = (product: IProduct) => {
  const { whitelabel } = useWhitelabel()

  // Initialize imageFiles array with empty strings to match existing images count
  const imageFiles = Array.isArray(product.image) && product.image.length > 0
    ? product.image.map(() => '')
    : ['']

  return {
    ecommerceId: whitelabel.value._id,
    productName: product.name,
    productPrice: product.price,
    productDescription: product.description,
    productType: typeof product.productType === 'object' && product.productType?.name
      ? product.productType.name
      : '',
    stockOption: product.stock?.type || 'UNLIMITED',
    stockQuantity: product.stock?.quantity || null,
    imageFiles, // Initialize with empty strings for each existing image
    userFields: product.fields || [],
  }
}

const updateProduct = async (values: any) => {
  const { put, clearProductsCache } = useApi()

  await put(`/products/${productId}`, {
    ecommerceId: values.ecommerceId,
    name: values.productName,
    price: values.productPrice,
    description: values.productDescription,
    productType: values.productType,
    fields: values.userFields,
    image: values.imageUrls,
    stock: {
      type: values.stockOption,
      quantity: values.stockQuantity,
    },
  })

  // Clear all products cache for this ecommerce
  await clearProductsCache(values.ecommerceId)

  // Mark products for revalidation using localStorage
  const { markProductsForRevalidation, markProductIdsForRevalidation } = await import('~/utils/revalidation')
  markProductsForRevalidation()
  markProductIdsForRevalidation([productId])

  handleSuccess('Produto atualizado com sucesso!')
  router.push('/admin/products')
}

onMounted(async () => {
  const fetchedProduct = await getProductById(productId, { cache: 'no-cache' })
  if (fetchedProduct) {
    product.value = fetchedProduct
    initialValues.value = transformProductToFormValues(fetchedProduct)
  }
})
</script>

<style scoped lang="scss">
.edit-product {
  .page-header {
    margin-bottom: 24px;

    h1 {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1d1d1f;
    }
  }
}
</style>
