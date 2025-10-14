<template>
  <VeeForm
    v-slot="{ isSubmitting, errors, meta: { dirty }, values: { stockOption } }"
    :validation-schema="validationSchema"
    :initial-values="{ userFields: [], ...initialValues }"
    @submit="submit"
    @invalid-submit="onInvalidSubmit"
  >
    <DetailFields
      :product-types="productTypes"
      :on-register-new-product-type="onRegisterNewProductType"
    />
    <StockFields :show-stock-quantity="stockOption === StockOptions.LIMITED" />
    <Images :errors :old-image-urls="oldImageUrls" />
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
          @click="goBackOrHome"
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
          :loading="isSubmitting || isLoading"
          :disabled="!isEdition && !dirty"
        >
          {{ isEdition ? 'Editar' : 'Adicionar' }}
        </VeeButton>
      </VCol>
    </VRow>
  </VeeForm>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import UserQuestions from '~/components/Md/ProductForm/components/UserQuestions.vue'
import Images from '~/components/Md/ProductForm/components/Images.vue'
import StockFields from '~/components/Md/ProductForm/components/StockFields.vue'
import { StockOptions } from '~/components/Md/ProductForm/types/stock'
import DetailFields from '~/components/Md/ProductForm/components/DetailFields.vue'
import { validationSchema } from '~/components/Md/ProductForm/zod/schema'
import { UserFieldTypeLabel } from '~/types/product'

const props = defineProps<{
  action: (values: Record<string, any>) => Promise<void>
  onRegisterNewProductType?: () => void
  updateProductList?: (params: { cache: 'no-cache' | 'force-cache' }) => Promise<void>
  initialValues?: Record<string, any>
  oldImageUrls?: string[]
}>()

const { productTypes } = useProductTypes()
const { upload } = useUpload()

const isEdition = !!props.initialValues

const isLoading = ref(false)

const getUpdatedImageUrls = async (images: (File | string)[]): Promise<string[]> => {
  const uploadedUrls: string[] = []

  // Upload images sequentially to avoid overwhelming the server
  for (let fileIdx = 0; fileIdx < images.length; fileIdx++) {
    const file = images[fileIdx]
    const oldImage = props.oldImageUrls?.[fileIdx]

    // If no file was selected (empty string or null), keep the old image
    if (!file || file === '' || (typeof file === 'string' && !file.startsWith('http'))) {
      if (oldImage) {
        uploadedUrls.push(oldImage)
      }
      continue
    }

    // If it's a File object, upload it
    if (file instanceof File) {
      uploadedUrls.push(await upload(file))
    } else if (typeof file === 'string' && file.startsWith('http')) {
      // If it's already a URL, keep it
      uploadedUrls.push(file)
    }

    // Small delay between uploads to prevent rate limiting (except for last image)
    if (fileIdx < images.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 200))
    }
  }

  return uploadedUrls
}

const onInvalidSubmit = ({ errors }: { errors: Record<string, any> }) => {
  console.log('Validation errors:', errors)

  // Extract all error messages
  const extractErrors = (obj: any, path = ''): string[] => {
    const messages: string[] = []

    if (typeof obj === 'string') {
      messages.push(obj)
    } else if (obj && typeof obj === 'object') {
      for (const key in obj) {
        const newPath = path ? `${path}.${key}` : key
        messages.push(...extractErrors(obj[key], newPath))
      }
    }

    return messages
  }

  const errorMessages = extractErrors(errors)
  const firstError = errorMessages[0] || 'Por favor, preencha todos os campos obrigatórios'

  handleError(firstError)
}

const submit = async (values: Record<string, any>) => {
  isLoading.value = true
  const { whitelabel } = useWhitelabel()

  const newImageUrls = await getUpdatedImageUrls(values.imageFiles)

  try {
    // Process userFields to upload variant option images
    const processedUserFields = await Promise.all(values.userFields.map(async (field) => {
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

      // If field has options, process each option to upload images sequentially
      if (field.options && Array.isArray(field.options)) {
        const processedOptions: any[] = []
        for (const option of field.options) {
          if (option.image && option.image instanceof File) {
            const imageUrl = await upload(option.image)
            processedOptions.push({
              name: option.name,
              hex: option.hex || undefined,
              image: imageUrl,
            })
          } else {
            processedOptions.push({
              name: option.name,
              hex: option.hex || undefined,
              image: option.image || undefined,
            })
          }
          // Small delay between uploads
          await new Promise(resolve => setTimeout(resolve, 200))
        }

        // Remove _id from field object (it's auto-generated by MongoDB)
        const { _id, ...fieldWithoutId } = field
        return { ...fieldWithoutId, type, options: processedOptions }
      }

      // Remove _id from field object
      const { _id, ...fieldWithoutId } = field
      return { ...fieldWithoutId, type }
    }))

    await props.action({
      ...values,
      stock: {
        type: values.stockOption,
        quantity: values?.stockQuantity || null,
      },
      ecommerceId: whitelabel.value._id,
      imageUrls: newImageUrls,
      productType: productTypes.value.find((type: IProductType) => type.name === values.productType)?.id || '',
      userFields: processedUserFields,
    })
    handleSuccess(`Produto ${isEdition ? 'editado' : 'adicionado'} com sucesso!`)

    goBackOrHome()
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
