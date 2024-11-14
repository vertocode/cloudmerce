<template>
  <VeeForm :validationSchema="validationSchema" @submit="submit" v-slot="{ isSubmitting }">
    <div class="field-container">
      <VRow>
        <VCol cols="12" md="6" class="pl-0 pb-0">
          <VeeTextField
              name="productName"
              label="Nome do Produto"
              variant="outlined"
              required
          />
        </VCol>

        <VCol cols="12" md="6" class="pr-0 pb-0">
          <VeeTextField
              name="productPrice"
              label="Preço do Produto"
              variant="outlined"
              type="number"
              prefix="R$"
              required
          />
        </VCol>

        <VCol cols="12">
          <VeeTextarea
              name="productDescription"
              label="Descrição do Produto"
              variant="outlined"
              rows="4"
              required
          />
        </VCol>

        <VCol cols="12" class="product-type-container">
          <VeeSelect
              name="productType"
              :items="productTypes.map(type => type.name)"
              placeholder="Selecione o tipo de produto"
              label="Tipo de Produto"
              variant="outlined"
              no-data-text="Sem opções, clique para cadastrar um novo tipo de produto abaixo deste input."
              required
          />
          <span v-if="onRegisterNewProductType" class="product-type-message" @click="onRegisterNewProductType">
              Cadastrar novo tipo de produto <VIcon color="var(--secondary-700)">mdi-link</VIcon>
          </span>
        </VCol>

        <h5 class="mt-5">
          Você deve colocar o link da imagem aqui. É possível usar qualquer serviço de armazenamento em nuvem, como
          <a href="https://imgur.com/">Imgur</a> ou outro de sua preferência. (Opcional, mas recomendado.)
        </h5>
        <VCol
            cols="12"
            :md="imageUrls.length === 1 ? 12 : 6"
            v-for="(_, index) in imageUrls"
            :key="index"
            class="image-field mt-0"
            :class="index % 2 === 0 ? 'pl-0' : 'pr-0'"
        >
          <VeeTextField
              name="imageUrls"
              v-model="imageUrls[index]"
              :label="`URL da imagem ${index + 1}`"
              variant="outlined"
          />
          <VeeButton
              v-if="imageUrls.length > 1"
              icon
              class="remove-btn mb-6"
              @click="removeImageField(index)"
          >
            <VIcon>mdi-delete</VIcon>
          </VeeButton>
        </VCol>
        <VCol cols="12">
          <VeeButton @click="addImageField" color="primary" class="mb-8 float-end">
            <VIcon color="white">mdi-plus</VIcon> Adicionar imagem
          </VeeButton>
        </VCol>
      </VRow>
      <h5>Adicione perguntas para o usuário responder, como tamanho de uma roupa, cor ou qualquer outra pergunta necessária para este produto.</h5>
      <VRow v-if="userFields.length > 0" v-for="(_, index) in userFields" :key="index">
        <VCol
            cols="10"
            md="6"
            class="user-field mt-0 pl-0"
        >
          <VeeTextField
              :name="`questionNameUser${index}`"
              v-model="userFields[index].label"
              :label="`Nome do campo ${index + 1}`"
              variant="outlined"
          />
        </VCol>

        <VCol
            cols="10"
            md="4"
            class="user-field mt-0 pl-0"
        >
          <VeeSelect
              :name="`questionTypeUser${index}`"
              :label="`Tipo do campo ${index + 1}`"
              :items="['Texto', 'Número', 'Opções']"
              variant="outlined"
          />
        </VCol>
        <VCol cols="2">
          <VeeButton
              icon
              class="remove-btn mt-4"
              @click="removeUserField(index)"
          >
            <VIcon>mdi-delete</VIcon>
          </VeeButton>
        </VCol>
        <h5 class="w-100 mb-3" v-if="userFields[index].type === UserFieldTypeLabel.options">Opções para o campo {{ index + 1 }}:</h5>
        <VCol
            cols="6"
            v-if="userFields[index].type === UserFieldTypeLabel.options"
            v-for="(_, optionIndex) in userFields[index].options"
            :key="optionIndex"
            class="image-field mt-0"
        >
          <VeeTextField
              :name="`questionUser${index}Option${optionIndex}`"
              v-model="(userFields[index].options || [])[optionIndex] as string"
              :label="`Opção ${optionIndex + 1}`"
              variant="outlined"
              required
          />
          <VeeButton
              v-if="userFields[index] && userFields[index]?.options?.length > 1"
              icon
              class="remove-btn mb-6"
              @click="removeUserFieldOption(index, optionIndex)"
          >
            <VIcon>mdi-delete</VIcon>
          </VeeButton>
        </VCol>
        <VCol cols="12">
          <VeeButton v-if="userFields[index].type === UserFieldTypeLabel.options" @click="addUserFieldOption(index)" variant="outlined" class="mb-8 float-end">
            Adicionar opção para o campo {{ index + 1 }}
          </VeeButton>
        </VCol>
      </VRow>
      <VRow>
        <VCol cols="12">
          <VeeButton @click="addUserField" color="primary" class="mb-8 float-end mt-3">
            <VIcon color="white">mdi-plus</VIcon> Adicionar pergunta de usuário
          </VeeButton>
        </VCol>
      </VRow>
    </div>

    <VSpacer class="my-6"/>

    <VRow justify="end" align-content="end" no-gutters>
      <VCol cols="6">
        <VeeButton size="large" variant="text" width="100%" @click="onClose">
          Cancelar
        </VeeButton>
      </VCol>
      <VCol cols="6">
        <VeeButton size="large" variant="tonal" color="primary" width="100%" type="submit" :loading="isSubmitting">
          {{ isEdition ? 'Editar' : 'Adicionar' }}
        </VeeButton>
      </VCol>
    </VRow>
  </VeeForm>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { z } from 'zod'
import { useStoreData } from '~/composables/useStoreData'
import type { IProductType } from '~/composables/useStoreData'
import { UserFieldTypeLabel } from '~/types/product'

interface UserFieldWithLabel {
  label: string
  type: UserFieldTypeLabel
  options?: string[]
}

const props = defineProps<{
  action: (values: Record<string, any>) => Promise<void>
  onClose: () => void
  onRegisterNewProductType?: () => void
  updateProductList?: (params: { cache: 'no-cache' | 'force-cache' }) => Promise<void>
  initialValues?: Record<string, any>
}>()

const products = useState('products', () => [])
const { productTypes, ecommerceId } = useStoreData()

const isEdition = !!props.initialValues

const isLoading = ref(false)
const imageUrls = ref(props?.initialValues?.imageUrls || [''])
const userFields = ref<UserFieldWithLabel[]>(props?.initialValues?.userFields.map((field: UserFieldWithLabel) => ({
  ...field,
  type: getFieldLabel(field.type)
})) || [])

const addImageField = () => {
  imageUrls.value.push('')
}

const removeImageField = (index: number) => {
  imageUrls.value.splice(index, 1)
}

const addUserField = () => {
  userFields.value.push({
    label: '',
    type: UserFieldTypeLabel.options,
    options: ['']
  })
}

const removeUserField = (index: number) => {
  userFields.value.splice(index, 1)
}

const addUserFieldOption = (index: number) => {
  userFields.value[index].options?.push('')
}

const removeUserFieldOption = (fieldIndex: number, optionIndex: number) => {
  if (userFields.value[fieldIndex].type === UserFieldTypeLabel.options && userFields.value[fieldIndex].options?.length === 1) {
    return
  }
  userFields.value[fieldIndex].options?.splice(optionIndex, 1)
}

const submit = async (values: Record<string, any>) => {
  isLoading.value = true

  try {
    await props.action({
      ...values,
      imageUrls: imageUrls.value,
      ecommerceId: ecommerceId,
      productType: productTypes.value.find((type: IProductType) => type.name === values.productType)?.id || '',
      userFields: userFields.value.map(field => {
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
      })
    })
    props.onClose()
    handleSuccess(`Produto ${isEdition ? 'editado' : 'adicionado'} com sucesso!`)

    if (products.value.length < 20 && props.updateProductList) {
      await props.updateProductList({ cache: 'no-cache' })
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes('PRODUCT_EXISTS')) {
      handleError(`Erro: ${error.message}`)
    } else {
      handleError(`Erro ao ${isEdition ? 'editar' : 'adicionar'} produto`)
    }
  } finally {
    isLoading.value = false
  }
}

const validationSchema = z.object({
  productName: z.string().min(3, { message: 'Nome do produto deve ter pelo menos 3 caracteres' }),
  productPrice: z.number().min(0, { message: 'Preço do produto deve ser maior ou igual a 0' }),
  productDescription: z.string().min(10, { message: 'Descrição deve ter pelo menos 10 caracteres' }),
  productType: z.string().nonempty({ message: 'O tipo de produto é obrigatório' }),
  imageUrls: z.array(z.string().url({ message: 'Deve ser uma URL válida' })).optional(),
  userFields: z.array(z.object({
    label: z.string().min(1, { message: 'Nome do campo não pode ser vazio' }),
    type: z.enum(['Texto', 'Número', 'Opções']),
    options: z.array(z.string()).optional(),
  })).optional()
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

.field-container {
  max-height: 70vh;
  overflow-y: auto;
}

.remove-btn {
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
