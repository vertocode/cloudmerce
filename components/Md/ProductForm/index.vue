<template>
  <VeeForm
    v-slot="{ isSubmitting, errors, meta: { dirty }, values: { stockOption } }"
    :validation-schema="validationSchema"
    :initial-values="{ userFields: [], ...initialValues }"
    @submit="submit"
  >
    <DetailFields
      :product-types="productTypes"
      :on-register-new-product-type="onRegisterNewProductType"
    />
    <StockFields :show-stock-quantity="stockOption === StockOptions.LIMITED" />
    <Images :errors />
    <UserQuestions />

    <VSpacer class="my-6" />

    <VRow
      justify="end"
      align-content="end"
      no-gutters
    >
      <VCol cols="6">
        <VBtn
          size="large"
          variant="text"
          width="100%"
          @click="onClose"
        >
          Cancelar
        </VBtn>
      </VCol>
      <VCol cols="6">
        <VeeButton
          size="large"
          variant="tonal"
          color="primary"
          width="100%"
          :loading="isSubmitting"
          :disabled="!dirty"
        >
          {{ isEdition ? 'Editar' : 'Adicionar' }}
        </VeeButton>
      </VCol>
    </VRow>
  </VeeForm>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { UserFieldTypeLabel } from '~/types/product'
import UserQuestions from '~/components/Md/ProductForm/components/UserQuestions.vue'
import Images from '~/components/Md/ProductForm/components/Images.vue'
import StockFields from '~/components/Md/ProductForm/components/StockFields.vue'
import { StockOptions } from '~/components/Md/ProductForm/types/stock'
import DetailFields from '~/components/Md/ProductForm/components/DetailFields.vue'
import { validationSchema } from '~/components/Md/ProductForm/zod/schema'

const props = defineProps<{
  action: (values: Record<string, any>) => Promise<void>
  onClose: () => void
  onRegisterNewProductType?: () => void
  updateProductList?: (params: { cache: 'no-cache' | 'force-cache' }) => Promise<void>
  initialValues?: Record<string, any>
}>()

const { productTypes } = useProductTypes()

const isEdition = !!props.initialValues

const isLoading = ref(false)

const submit = async (values: Record<string, any>) => {
  isLoading.value = true

  const { getWhitelabel } = useWhitelabel()
  const router = useRouter()

  try {
    const whitelabel = await getWhitelabel()
    if (!whitelabel) {
      throw new Error('Whitelabel not found')
    }
    await props.action({
      ...values,
      stock: {
        type: values.stockOption,
        quantity: values?.stockQuantity || null,
      },
      ecommerceId: whitelabel._id,
      productType: productTypes.value.find((type: IProductType) => type.name === values.productType)?.id || '',
      userFields: values.userFields.map((field) => {
        const type = (() => {
          switch (field.type) {
            case UserFieldTypeLabel.text:
              return 'text'
            case UserFieldTypeLabel.number:
              return 'number'
            case UserFieldTypeLabel.options:
              return 'options'
            default:
              return 'text'
          }
        })()
        return { ...field, type }
      }),
    })
    handleSuccess(`Produto ${isEdition ? 'editado' : 'adicionado'} com sucesso!`)

    await router.push('/')
  }
  catch (error) {
    if (error instanceof Error && error.message.includes('PRODUCT_EXISTS')) {
      handleError(`Erro: ${error.message}`)
    }
    else {
      handleError(`Erro ao ${isEdition ? 'editar' : 'adicionar'} produto`)
    }
  }
  finally {
    isLoading.value = false
  }
}
</script>

<style scoped lang="scss">
.add-product-modal {
  .v-card {
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
}

:deep(.remove-btn) {
  .v-icon {
    color: var(--danger-color-500);
  }
}

:deep(h3) {
  font-size: 1.2rem;
  font-weight: 500;
  color: #333;
}
</style>
