<template>
  <div class="product-type">
    <header>
      <VIcon @click="$router.back()">
        mdi-arrow-left
      </VIcon>
      <h1>Tipos de Produto</h1>
    </header>
    <VeeForm
      v-slot="{ isSubmitting }"
      @submit="submit"
    >
      <div
        v-if="newProductTypes.length"
        class="product-type-fields"
      >
        <div
          v-for="(type, index) in newProductTypes"
          :key="type.id"
          class="product-type-item"
        >
          <VeeTextField
            v-model="type.name"
            :name="'productType' + index"
            :rules="rules"
            label="Nome do Tipo de Produto"
            outlined
            @input="() => editProductTypeName(index, type.name)"
          />
          <DeleteProductType
            :product-type="type.name"
            :on-confirm="() => deleteProductType(type.id)"
          >
            <VBtn
              icon
              class="remove-btn"
            >
              <VIcon>mdi-delete</VIcon>
            </VBtn>
          </DeleteProductType>
        </div>
      </div>
      <VBtn
        class="w-100 mb-8"
        color="primary"
        @click="newProductTypes.push({ name: '', id: String(newProductTypes.length + 1) })"
      >
        Adicionar novo tipo de produto
      </VBtn>

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
import DeleteProductType from '~/components/Md/DeleteProductType/index.vue'

const isLoading = ref(false)
const { productTypes, updateProductTypes } = useProductTypes()
const { put } = useApi()

const rules = [
  (v: string | null) => !!v || 'Nome do tipo de produto é obrigatório',
  (v: string | null) => !!v && v.length <= 25 || 'Nome do tipo de produto deve ter no máximo 25 caracteres',
  (v: string | null) => !!v && v.length >= 3 || 'Nome do tipo de produto deve ter no mínimo 3 caracteres',
]

const oldProductTypes = ref(cloneArray(productTypes.value))
const newProductTypes = ref(cloneArray(productTypes.value))

watch(productTypes, () => {
  newProductTypes.value = cloneArray(productTypes.value)
  oldProductTypes.value = cloneArray(productTypes.value)
})

const validateFields = () => {
  return newProductTypes.value.every((productType) => {
    return rules.every((rule) => {
      const value = productType.name
      if (typeof rule(value) === 'boolean') {
        return true
      }
      console.warn(`field ${value} is not valid for rule: ${rule(value)}`)
      return false
    })
  })
}

const submit = async () => {
  if (!validateFields()) return

  isLoading.value = true
  try {
    const productTypesToDelete = oldProductTypes.value.filter(type => !newProductTypes.value.some(newType => newType.id === type.id))
    const productTypesToAdd = newProductTypes.value.filter(type => !oldProductTypes.value.some(oldType => oldType.id === type.id))
    const productTypesToUpdate = newProductTypes.value.filter((type) => {
      const oldProductType = oldProductTypes.value.find(oldType => oldType.id === type.id)
      return oldProductType && oldProductType.name !== type.name
    })

    const { getWhitelabel } = useWhitelabel()

    const whitelabel = await getWhitelabel()

    if (!whitelabel) {
      throw new Error('Whitelabel not found')
    }

    const ecommerceId = whitelabel._id

    const productTypes = [
      ...productTypesToUpdate.map(type => ({ ecommerceId, id: type.id, name: type.name, action: 'update' })),
      ...productTypesToAdd.map(type => ({ ecommerceId, name: type.name, action: 'add' })),
      ...productTypesToDelete.map(type => ({ ecommerceId, id: type.id, action: 'delete' })),
    ]

    if (!productTypes.length) {
      handleWarning('Nenhuma alteração foi feita, os tipos de produto estão iguais aos anteriores e o modal apenas foi fechado')
      return
    }

    await put('/product-types/multiple-update', { productTypes })
    await updateProductTypes({ cache: 'no-cache' })
  }
  catch (error) {
    console.error(error)
    handleError('Erro ao salvar tipo de produto')
  }
  finally {
    isLoading.value = false
  }
}

const deleteProductType = async (id: string) => {
  newProductTypes.value = newProductTypes.value.filter(type => type.id !== id)
}

const editProductTypeName = (index: number, value: string) => {
  newProductTypes.value[index].name = value
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
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;

  .remove-btn {
    margin-bottom: 24px;

    .v-icon {
      color: var(--danger-color-500);
    }
  }
}

.product-type-fields {
  max-height: 500px;
  overflow-y: auto;
  padding-top: 8px;
}
</style>
