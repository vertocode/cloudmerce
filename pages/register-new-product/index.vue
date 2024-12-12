<template>
  <div class="register-product">
    <h1>Registrar um novo produto</h1>
    <MdProductForm
      :on-register-new-product-type="onRegisterNewProductType"
      :on-close="onClose"
      :action="register"
    />
  </div>
</template>

<script setup lang="ts">
const onRegisterNewProductType = () => {
  const router = useRouter()
  router.push('/product-type')
}

const onClose = () => {
  const router = useRouter()
  router.push('/')
}

const register = async (values: any) => {
  const { post } = useApi()

  await post('/products', {
    ecommerceId: values.ecommerceId,
    name: values.productName,
    price: values.productPrice,
    description: values.productDescription,
    productType: values.productType,
    fields: values.userFields,
    image: values.imageUrls,
  })
}
</script>

<style scoped lang="scss">
.register-product {
  padding: 24px 0;
}
</style>
