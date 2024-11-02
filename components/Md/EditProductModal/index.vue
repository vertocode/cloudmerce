<template>
  <Modal
      max-width="800"
      :is-opened="showEditModal"
      :card-props="{ title: `Editar Produto ${initialValues.productName || ''}` }"
  >
    <template #trigger>
      <div class="w-100" @click="showEditModal = true">
        <slot />
      </div>
    </template>
    <ProductForm
        :updateProductList
        :initialValues
        :onClose
        :action="updateProduct"
    />
  </Modal>
</template>

<script setup lang="ts">
import Modal from '~/components/El/Modal/index.vue'
import ProductForm from '~/components/Md/ProductForm/index.vue'
import type { ActionParams, InitialValues } from '~/components/Md/ProductForm/index.vue'
import type {IProduct} from "~/types/product";

const showEditModal = ref(false)

const onClose = () => showEditModal.value = false

const props = defineProps<{
  initialValues: IProduct
  updateProductList: (param: { cache: 'no-cache' | 'force-cache' }) => Promise<void>
}>()

const { put } = useApi()

const initialValues = computed((): InitialValues => {
  const product = props.initialValues

  return {
    productName: product.name || '',
    productType: product.productType || '',
    imageUrls: Array.isArray(product.image) ? (product.image || '') : [product.image || ''],
    productDescription: product.description || '',
    productPrice: product.price || 0
  }
})

const updateProduct = async (values: ActionParams) => {
  await put(`/products/${props.initialValues.id}`, {
    ecommerceId: values.ecommerceId,
    name: values.productName,
    price: values.productPrice,
    description: values.productDescription,
    productType: values.productType,
    image: values.imageUrls,
  });
}
</script>
