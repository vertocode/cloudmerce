<template>
  <Modal
    max-width="800"
    persistent
    :is-opened="showEditModal"
    :card-props="{ title: `Editar Produto ${initialValues.productName || ''}` }"
    @close="onClose"
  >
    <template #trigger>
      <div
        class="w-100"
        @click="showEditModal = true"
      >
        <slot />
      </div>
    </template>
    <ProductForm
      :update-product-list
      :initial-values
      :on-close
      :action="updateProduct"
    />
  </Modal>
</template>

<script setup lang="ts">
import Modal from '~/components/El/Modal/index.vue'
import ProductForm from '~/components/Md/ProductForm/index.vue'
import type { IProduct } from '~/types/product'

const showEditModal = ref(false)

const onClose = () => showEditModal.value = false

const props = defineProps<{
  initialValues: IProduct
  updateProductList: (param: { cache: 'no-cache' | 'force-cache' }) => Promise<void>
}>()

const { put } = useApi()

const { getProductTypeById } = useStoreData()

const initialValues = computed(() => {
  const product = props.initialValues

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
  await put(`/products/${props.initialValues.id}`, {
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
