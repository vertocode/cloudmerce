<template>
  <div class="product-type">
    <header>
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
              placeholder="shoe-sneaker"
              :prepend-icon="type.value?.icon?.includes('mdi') ? type.value.icon : `mdi-${type.value?.icon}`"
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

      <VAlert
        v-if="errorMessage"
        type="error"
        class="mb-4"
        closable
        @click:close="errorMessage = ''"
      >
        {{ errorMessage }}
      </VAlert>

      <VRow>
        <VCol
          cols="6"
          md="6"
        >
          <VBtn
            width="100%"
            variant="outlined"
            @click="$router.push('/admin')"
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

definePageMeta({
  layout: 'admin',
  middleware: ['03-admin-auth'],
})

const isLoading = ref(false)
const errorMessage = ref('')
const { productTypes, updateProductTypes } = useProductTypes()
const { put, clearCacheKey } = useApi()

const oldProductTypes = ref<IProductType[]>(cloneArray(productTypes.value))

const initialValues = computed(() => ({
  productTypes: productTypes.value.map(type => ({ icon: type.icon || '', name: type.name, id: type.id })),
}))

watch(productTypes, () => {
  oldProductTypes.value = cloneArray(productTypes.value)
})

const submit = async (values: { productTypes: IProductType[] }) => {
  isLoading.value = true
  errorMessage.value = ''
  try {
    const { productTypes: newProductTypes = [] } = values
    const productTypesToDelete = oldProductTypes.value.filter(type => !newProductTypes.some(newType => newType.id === type.id))
    const productTypesToAdd = newProductTypes.filter(type => !oldProductTypes.value.some(oldType => oldType.id === type.id))
    const productTypesToUpdate = newProductTypes.filter((type) => {
      const oldProductType = oldProductTypes.value.find(oldType => oldType.id === type.id)
      return oldProductType && (oldProductType.name !== type.name || oldProductType.icon !== type.icon)
    })

    const { whitelabel } = useWhitelabel()

    const ecommerceId = whitelabel.value._id

    const productTypes = [
      ...productTypesToUpdate.map(type => ({ ecommerceId, id: type.id, name: type.name, icon: type.icon, action: 'update' })),
      ...productTypesToAdd.map(type => ({ ecommerceId, name: type.name, icon: type.icon, action: 'add' })),
      ...productTypesToDelete.map(type => ({ ecommerceId, id: type.id, action: 'delete' })),
    ]

    await put('/product-types/multiple-update', { productTypes })

    console.log('Clearing cache for key:', `product-types-${ecommerceId}`)
    // Clear server-side cache for product types
    await clearCacheKey(`product-types-${ecommerceId}`)

    console.log('Forcing refresh of product types')
    // Force refresh the product types from the server
    productTypes.value = []
    await updateProductTypes({ cache: 'no-cache' })

    console.log('Updated product types:', productTypes.value)

    handleSuccess('Tipos de produto salvos com sucesso')
    navigateTo('/admin')
  }
  catch (error: any) {
    console.error('Full error object:', error)

    // Extract the error message from various possible structures
    let apiErrorMessage = error?.data?.error || error?.data?.message || error?.message

    // If the error message contains the CustomError prefix, extract just the Portuguese message
    if (apiErrorMessage && typeof apiErrorMessage === 'string') {
      const customErrorMatch = apiErrorMessage.match(/CustomError:\s*(.+)/)
      if (customErrorMatch) {
        apiErrorMessage = customErrorMatch[1]
      }
      // Remove the "Error updating the product types: " prefix if present
      apiErrorMessage = apiErrorMessage.replace(/^Error updating the product types:\s*/i, '')
    }

    errorMessage.value = apiErrorMessage || 'Erro ao salvar tipo de produto'
    handleError(errorMessage.value)
  }
  finally {
    isLoading.value = false
  }
}
</script>

<style scoped lang="scss">
header {
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  h1 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1d1d1f;
  }

  a {
    font-size: 0.875rem;
    color: var(--primary-color);
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
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
