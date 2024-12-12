<template>
  <div class="register-product">
    <h1>Editar produto</h1>
    <MdProductForm
      :on-register-new-product-type="onRegisterNewProductType"
      :on-close="onClose"
      :action="updateProduct"
      :initial-values="initialValues"
    />
  </div>
</template>

<script setup lang="ts">
const { getProductById } = useProduct({})

const route = useRoute()

const product = await getProductById(route.params.id as string)

const onRegisterNewProductType = () => {
  const router = useRouter()
  router.push('/product-type')
}

const onClose = () => {
  const router = useRouter()
  router.push('/')
}

const initialValues = computed(() => {
  const { getProductTypeById } = useProductTypes()
  if (!product) return {}

  return {
    productName: product.name || '',
    productType: getProductTypeById(product.productType)?.name || '',
    imageUrls: Array.isArray(product.image) ? (product.image || '') : [product.image || ''],
    productDescription: product.description || '',
    productPrice: product.price || 0,
    userFields: product.fields.map(field => ({
      ...field,
      type: getFieldLabel(field.type),
    })) || [],
  }
})

const updateProduct = async (values: Record<string, any>) => {
  if (!product) {
    throw new Error('Produto não encontrado')
  }

  const { put } = useApi()
  await put(`/products/${product.id}`, {
    ecommerceId: values.ecommerceId,
    name: values.productName,
    price: values.productPrice,
    description: values.productDescription,
    productType: values.productType,
    image: values.imageUrls,
    fields: values.userFields,
  })
}
</script>

<style scoped lang="scss">
.register-product {
  padding: 24px 0;
}
</style>
