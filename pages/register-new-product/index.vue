<template>
  <div class="register-product">
    <header>
      <VIcon @click="$router.back()">
        mdi-arrow-left
      </VIcon>
      <h1>Registrar um novo produto</h1>
    </header>
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

  header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 24px;

    .v-icon {
      cursor: pointer;
    }
  }
}
</style>
