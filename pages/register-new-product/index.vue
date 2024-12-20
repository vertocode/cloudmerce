<template>
  <div class="register-product">
    <header>
      <VIcon @click="$router.back()">
        mdi-arrow-left
      </VIcon>
      <h1>Cadastrar Novo Produto</h1>
    </header>
    <MdProductForm
      :on-register-new-product-type="onRegisterNewProductType"
      :on-close="onClose"
      :action="register"
    />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['03-admin-auth'],
})

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
