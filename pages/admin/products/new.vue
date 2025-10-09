<template>
  <div class="register-product">
    <header>
      <h1>Cadastrar Novo Produto</h1>
    </header>
    <MdProductForm
      :on-register-new-product-type="onRegisterNewProductType"
      :action="register"
    />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['03-admin-auth'],
})

const onRegisterNewProductType = () => {
  const router = useRouter()
  router.push('/admin/product-types')
}

const register = async (values: any) => {
  const { post, clearCacheKey } = useApi()

  const response = await post('/products', {
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

  // Clear products list cache for this ecommerce
  await clearCacheKey(`products-${values.ecommerceId}-{}`)

  // Clear individual product cache if product has an ID
  if ((response as any)?._id) {
    await clearCacheKey(`product-${values.ecommerceId}-${(response as any)._id}`)
  }

  // Force refresh products list in the state
  const products = useState<any[]>('products', () => [])
  products.value = []
}
</script>

<style scoped lang="scss">
.register-product {
  header {
    margin-bottom: 24px;

    h1 {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1d1d1f;
    }
  }
}
</style>
