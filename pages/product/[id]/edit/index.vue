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
    />
  </div>
</template>

<script setup lang="ts">
import { StockOptions } from '~/components/Md/ProductForm/types/stock'

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
    stockOption: product.stock?.type || StockOptions.UNLIMITED,
    stockQuantity: product.stock?.quantity || null,
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
    stock: {
      type: values.stockOption,
      quantity: values.stockQuantity,
    },
  })
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
