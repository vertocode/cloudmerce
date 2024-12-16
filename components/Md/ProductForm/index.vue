<template>
  <VeeForm
    v-slot="{ isSubmitting, errors, meta: { dirty } }"
    :validation-schema="validationSchema"
    :initial-values="{ userFields: [], ...initialValues }"
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

        <h5 class="mt-5">
          Você deve colocar o link da imagem aqui. É possível usar qualquer serviço de armazenamento em nuvem, como
          <a href="https://imgur.com/">Imgur</a> ou outro de sua preferência.
        </h5>
        <FieldArray
          v-slot="{ fields, push, remove }"
          name="imageUrls"
        >
          <VCol
            v-for="(_, index) in fields"
            :key="`image-field-${index}`"
            cols="12"
            :md="fields.length === 1 ? 12 : 6"
            class="image-field mt-0"
          >
            <VeeTextField
              :name="`imageUrls[${index}]`"
              :label="`URL da imagem ${index + 1}`"
              variant="outlined"
            />
            <VBtn
              v-if="fields.length > 1"
              icon
              class="remove-btn mb-6"
              @click="remove(index)"
            >
              <VIcon>mdi-delete</VIcon>
            </VBtn>
          </VCol>
          <VCol cols="12">
            <VBtn
              color="primary"
              class="mb-8 float-end"
              @click="push('')"
            >
              <VIcon color="white">
                mdi-plus
              </VIcon> Adicionar imagem
            </VBtn>
          </VCol>
        </FieldArray>
      </VRow>
      <VAlert
        v-if="errors.imageUrls"
        class="mb-5"
        color="warning"
      >
        <p v-if="errors.imageUrls">
          Adicione pelo menos uma imagem para o produto.
        </p>
      </VAlert>

      <h5>Adicione perguntas para o usuário responder, como tamanho de uma roupa, cor ou qualquer outra pergunta necessária para este produto.</h5>
      <FieldArray
        v-slot="{ fields, push, remove }"
        name="userFields"
      >
        <VRow
          v-for="(userQuestion, userIndex) in fields"
          v-if="fields.length > 0"
          :key="`user-field-${userIndex}`"
        >
          <VCol
            cols="10"
            md="6"
            class="user-field mt-0"
          >
            <VeeTextField
              :name="`userFields[${userIndex}].label`"
              :label="`Nome do campo ${userIndex + 1}`"
              variant="outlined"
            />
          </VCol>

          <VCol
            cols="10"
            md="4"
            class="user-field"
          >
            <VeeSelect
              :name="`userFields[${userIndex}].type`"
              :label="`Tipo do campo ${userIndex + 1}`"
              :items="['Texto', 'Número', 'Opções']"
              variant="outlined"
            />
          </VCol>
          <VCol cols="2">
            <VBtn
              icon
              class="remove-btn mt-4"
              @click="remove(userIndex)"
            >
              <VIcon>mdi-delete</VIcon>
            </VBtn>
          </VCol>
          <h5
            v-if="userQuestion.type === UserFieldTypeLabel.options"
            class="w-100 mb-3"
          >
            Opções para o campo {{ userIndex + 1 }}:
          </h5>
          <FieldArray
            v-slot="{ fields: userOptions, push: addUserOption, remove: removeUserOption }"
            :name="`userFields[${userIndex}].options`"
          >
            <VCol
              v-for="(_, optionIndex) in userOptions"
              :key="optionIndex"
              cols="6"
              class="image-field mt-0"
            >
              <VeeTextField
                :name="`userFields[${userIndex}].options[${optionIndex}]`"
                :label="`Opção ${optionIndex + 1}`"
                variant="outlined"
              />
              <VBtn
                v-if="userOptions.length > 1"
                icon
                class="remove-btn mb-6"
                :class="optionIndex % 2 === 0 ? 'mr-4' : ''"
                @click="removeUserOption(optionIndex)"
              >
                <VIcon>mdi-delete</VIcon>
              </VBtn>
            </VCol>
            <VCol cols="12">
              <VBtn
                variant="outlined"
                class="mb-8 float-end"
                @click="addUserOption('')"
              >
                Adicionar opção para o campo {{ userIndex + 1 }}
              </VBtn>
            </VCol>
          </FieldArray>
        </VRow>
        <VRow>
          <VCol cols="12">
            <VBtn
              color="primary"
              class="mb-8 float-end mt-3"
              @click="push(initialUserField)"
            >
              <VIcon color="white">
                mdi-plus
              </VIcon> Adicionar pergunta de usuário
            </VBtn>
          </VCol>
        </VRow>
      </FieldArray>
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
import { FieldArray } from 'vee-validate'
import { UserFieldTypeLabel } from '~/types/product'

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

const initialUserField = {
  label: '',
  type: UserFieldTypeLabel.options,
  options: [''],
}

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
