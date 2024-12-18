<template>
  <VeeForm
    v-slot="{ isSubmitting, errors, meta: { dirty } }"
    :validation-schema="validationSchema"
    :initial-values="{ userFields: [], stock: 'limited', ...initialValues }"
    @submit="submit"
  >
    <div class="field-container">
      <VRow>
        <VCol
          cols="12"
          md="6"
        >
          <VeeTextField
            name="productName"
            label="Nome do Produto"
            variant="outlined"
          />
        </VCol>

        <VCol
          cols="12"
          md="6"
        >
          <VeeTextField
            name="productPrice"
            label="Preço do Produto"
            variant="outlined"
            type="number"
            prefix="R$"
          />
        </VCol>

        <VCol
          cols="12"
        >
          <VeeTextarea
            name="productDescription"
            label="Descrição do Produto"
            variant="outlined"
            rows="4"
          />
        </VCol>

        <VCol
          cols="12"
          class="product-type-container"
        >
          <VeeSelect
            name="productType"
            :items="productTypes.map(type => type.name)"
            placeholder="Selecione o tipo de produto"
            label="Tipo de Produto"
            variant="outlined"
            no-data-text="Sem opções, clique para cadastrar um novo tipo de produto abaixo deste input."
          />
          <span
            v-if="onRegisterNewProductType"
            class="product-type-message"
            @click="onRegisterNewProductType"
          >
            Cadastrar novo tipo de produto <VIcon color="var(--secondary-700)">mdi-link</VIcon>
          </span>
        </VCol>

        <VCol cols="12">
          <VeeRadioGroup
            name="stock"
            :options="[
              { label: 'Limitado', value: 'limited' },
              { label: 'Ilimitado', value: 'unlimited' },
            ]"
            label="Estoque"
          />
        </VCol>

        <Images :errors />
        <UserQuestions />
      </VRow>
    </div>

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
import { z } from 'zod'
import { UserFieldTypeLabel } from '~/types/product'
import UserQuestions from '~/components/Md/ProductForm/components/UserQuestions.vue'
import Images from '~/components/Md/ProductForm/components/Images.vue'

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

const validationSchema = z.object({
  productName: z.string().min(3, { message: 'Nome do produto deve ter pelo menos 3 caracteres' }),
  productPrice: z.number().min(10, { message: 'Preço do produto deve ser maior ou igual a R$10,00' }),
  productDescription: z.string().min(10, { message: 'Descrição deve ter pelo menos 10 caracteres' }),
  productType: z.string().nonempty({ message: 'O tipo de produto é obrigatório' }),
  imageUrls: z.array(z.string().url({ message: 'Deve ser uma URL válida' })).min(1, { message: 'Adicione pelo menos 1 imagem' }),
  userFields: z.array(z.object({
    label: z.string().min(1, { message: 'Nome do campo não pode ser vazio' }),
    type: z.enum(['Texto', 'Número', 'Opções']),
    options: z.array(z.string().min(1, 'Campo obrigatório')).min(1, 'Adicione pelo menos 1 opção').optional(),
  })),
})
</script>

<style scoped lang="scss">
.add-product-modal {
  .v-card {
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
}

.product-type-container {
  position: relative;

  .product-type-message {
    cursor: pointer;
    position: absolute;
    top: 58px;
    right: 8px;
    color: var(--secondary-color-700);
    font-size: .9rem;
  }
}

:deep(.remove-btn) {
  .v-icon {
    color: var(--danger-color-500);
  }
}

.image-field {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
}
</style>
