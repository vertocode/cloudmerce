<template>
  <Modal
    max-width="800"
    persistent
    :is-opened="showRegisterModal"
    :card-props="{ title: 'Adicionar Produto' }"
    @close="onClose"
  >
    <template #trigger>
      <div>
        <slot />
      </div>
    </template>
    <ProductForm
      :on-register-new-product-type="onRegisterNewProductType"
      :on-close="onClose"
      :action="register"
    />
  </Modal>
</template>

<script setup lang="ts">
import Modal from '~/components/El/Modal/index.vue'
import ProductForm from '~/components/Md/ProductForm/index.vue'

defineProps<{
  onRegisterNewProductType: () => void
  showRegisterModal: boolean
  onClose: () => void
}>()

const { post } = useApi()

const register = async (values: any) => {
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
