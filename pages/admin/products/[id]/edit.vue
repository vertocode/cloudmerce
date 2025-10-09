<template>
  <div class="edit-product">
    <div class="page-header">
      <h1>Editar Produto</h1>
    </div>

    <MdProductForm
      v-if="product"
      :product="product"
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
const { getProductById } = useProduct({})

const onRegisterNewProductType = () => {
  router.push('/admin/product-types')
}

const updateProduct = async (values: any) => {
  const { put, clearCacheKey } = useApi()

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

  // Clear products list cache
  await clearCacheKey(`products-${values.ecommerceId}-{}`)
  await clearCacheKey(`product-${values.ecommerceId}-${productId}`)

  // Force refresh products list
  const products = useState<any[]>('products', () => [])
  products.value = []

  handleSuccess('Produto atualizado com sucesso!')
  router.push('/admin/products')
}

onMounted(async () => {
  product.value = await getProductById(productId, { cache: 'no-cache' })
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
