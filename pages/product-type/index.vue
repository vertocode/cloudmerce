<template>
  <div class="product-type">
    <header>
      <VIcon @click="$router.back()">
        mdi-arrow-left
      </VIcon>
      <h1>Tipos de Produto</h1>
      <a
        href="https://pictogrammers.com/library/mdi/"
        target="_blank"
      >Icones MDI</a>
    </header>
    <VeeForm
      :key="JSON.stringify(initialValues)"
      v-slot="{ isSubmitting }"
      prevent-dirty
      :initial-values="initialValues"
      @submit="submit"
    >
      <div class="product-type-fields">
        <FieldArray
          v-slot="{ fields, push, remove }"
          name="productTypes"
        >
          <div
            v-for="(type, index) in fields"
            :key="type.value?.id || index"
            class="product-type-item"
          >
            <VeeTextField
              :name="`productTypes[${index}].icon`"
              placeholder="mdi-laptop"
              label="Icone MDI (Opcional)"
              outlined
            />
            <VeeTextField
              :name="`productTypes[${index}].name`"
              label="Nome do Tipo de Produto"
              outlined
            />
            <DeleteProductType
              :product-type="type.value?.name"
              :on-confirm="() => remove(index)"
            >
              <VBtn
                icon
                class="remove-btn"
              >
                <VIcon>mdi-delete</VIcon>
              </VBtn>
            </DeleteProductType>
          </div>
          <VBtn
            class="w-100 mb-8"
            color="primary"
            @click="push({ icon: '', name: '', id: String(fields.length + 1) })"
          >
            Adicionar novo tipo de produto
          </VBtn>
        </FieldArray>
      </div>

      <VSpacer />

      <VRow>
        <VCol
          cols="6"
          md="6"
        >
          <VBtn
            width="100%"
            variant="outlined"
            @click="$router.back()"
          >
            Cancelar
          </VBtn>
        </VCol>
        <VCol
          cols="6"
          md="6"
        >
          <VeeButton
            color="primary"
            width="100%"
            type="submit"
            :loading="isSubmitting"
          >
            Salvar
          </VeeButton>
        </VCol>
      </VRow>
    </VeeForm>
  </div>
</template>

<script setup lang="ts">
import { FieldArray } from 'vee-validate'
import DeleteProductType from '~/components/Md/DeleteProductType/index.vue'
import type { IProductType } from '~/composables/useProductTypes'

const isLoading = ref(false)
const { productTypes, updateProductTypes } = useProductTypes()
const router = useRouter()
const { put } = useApi()

const oldProductTypes = ref<IProductType[]>(cloneArray(productTypes.value))

const initialValues = computed(() => ({
  productTypes: productTypes.value.map(type => ({ icon: type.icon || '', name: type.name, id: type.id })),
}))

watch(productTypes, () => {
  oldProductTypes.value = cloneArray(productTypes.value)
})

const submit = async (values: { productTypes: IProductType[] }) => {
  isLoading.value = true
  try {
    const { productTypes: newProductTypes = [] } = values
    const productTypesToDelete = oldProductTypes.value.filter(type => !newProductTypes.some(newType => newType.id === type.id))
    const productTypesToAdd = newProductTypes.filter(type => !oldProductTypes.value.some(oldType => oldType.id === type.id))
    const productTypesToUpdate = newProductTypes.filter((type) => {
      const oldProductType = oldProductTypes.value.find(oldType => oldType.id === type.id)
      return oldProductType && (oldProductType.name !== type.name || oldProductType.icon !== type.icon)
    })

    const { getWhitelabel } = useWhitelabel()

    const whitelabel = await getWhitelabel()

    if (!whitelabel) {
      throw new Error('Whitelabel not found')
    }

    const ecommerceId = whitelabel._id

    const productTypes = [
      ...productTypesToUpdate.map(type => ({ ecommerceId, id: type.id, name: type.name, icon: type.icon, action: 'update' })),
      ...productTypesToAdd.map(type => ({ ecommerceId, name: type.name, icon: type.icon, action: 'add' })),
      ...productTypesToDelete.map(type => ({ ecommerceId, id: type.id, action: 'delete' })),
    ]

    await put('/product-types/multiple-update', { productTypes })
    await updateProductTypes({ cache: 'no-cache' })
    handleSuccess('Tipos de produto salvos com sucesso')
    router.push('/')
  }
  catch (error) {
    console.error(error)
    handleError('Erro ao salvar tipo de produto')
  }
  finally {
    isLoading.value = false
  }
}
</script>

<style scoped lang="scss">
header {
  margin-top: 12px;
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

.product-type-item {
  display: grid;
  grid-template-columns: 200px 1fr max-content;
  gap: 8px;
  margin-bottom: 8px;

  .remove-btn {
    margin-bottom: 24px;

    .v-icon {
      color: var(--danger-color-500);
    }
  }

  @media (max-width: $mobile-breakpoint) {
    padding: 12px;
    background-color: #E6E8EF;
    display: flex;
    flex-direction: column-reverse;
    border-radius: 12px;

    .remove-btn {
      float: right;
    }
  }
}

.product-type-fields {
  overflow-y: auto;
  padding-top: 8px;
}
</style>
