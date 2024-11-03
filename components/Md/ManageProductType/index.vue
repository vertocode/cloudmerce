<template>
  <Modal
      :is-opened="showProductTypeModal"
      :card-props="{ title: 'Tipos de Produto' }"
  >
    <VForm fast-fail @submit.prevent="submit">
      <div v-if="newProductTypes.length" class="product-type-fields">
        <div v-for="(type, index) in newProductTypes" :key="type.id" class="product-type-item">
          <VTextField
              class="w-100"
              v-model="type.name"
              :rules="rules"
              label="Nome do Tipo de Produto"
              outlined
              required
              @input="() => editProductTypeName(index, type.name)"
          />
          <DeleteProductType :product-type="type.name" :on-confirm="() => deleteProductType(type.id)">
            <VBtn icon="mdi-delete" color="error" />
          </DeleteProductType>
        </div>
      </div>
      <VBtn class="w-100 mb-8" color="primary" @click="newProductTypes.push({ name: '', id: String(newProductTypes.length + 1) })">
        Adicionar novo tipo de produto
      </VBtn>

      <VSpacer></VSpacer>

      <VRow class="ga-2" justify="end" align-content="end" no-gutters>
        <VCol cols="4">
          <VBtn variant="text" @click="onClose">
            Cancelar
          </VBtn>
        </VCol>
        <VCol cols="4">
          <VBtn
              variant="tonal"
              color="primary"
              width="100%"
              type="submit"
              :loading="isLoading"
          >
            {{ 'Salvar' }}
          </VBtn>
        </VCol>
      </VRow>
    </VForm>
  </Modal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Modal from '~/components/El/Modal/index.vue';
import DeleteProductType from '~/components/Md/DeleteProductType/index.vue';
import {type IProductType, useStoreData} from "~/composables/useStoreData";

const props = defineProps<{
  showProductTypeModal: boolean;
  onClose: () => void;
}>()

const isLoading = ref(false);

const { productTypes, ecommerceId, updateProductTypes } = useStoreData()
const { put } = useApi()

const rules =  [
    (v: string | null) => !!v || 'Nome do tipo de produto é obrigatório',
    (v: string | null) => !!v && v.length <= 25 || 'Nome do tipo de produto deve ter no máximo 25 caracteres',
    (v: string | null) => !!v && v.length >= 3 || 'Nome do tipo de produto deve ter no mínimo 3 caracteres'
]

const oldProductTypes = ref<IProductType[]>(cloneArray(productTypes.value))
const newProductTypes = ref<IProductType[]>(cloneArray(productTypes.value))

watch(productTypes, () => {
  newProductTypes.value = cloneArray(productTypes.value)
  oldProductTypes.value = cloneArray(productTypes.value)
})

const validateFields = () => {
  return newProductTypes.value.every((productType) => {
    return rules.every(rule => {
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

  isLoading.value = true;
  try {
    const productTypesToDelete = oldProductTypes.value.filter((type) => !newProductTypes.value.some((newType) => newType.id === type.id))
    const productTypesToAdd = newProductTypes.value.filter((type) => !oldProductTypes.value.some((oldType) => oldType.id === type.id))
    const productTypesToUpdate = newProductTypes.value.filter((type) => {
      const oldProductType = oldProductTypes.value.find((oldType) => oldType.id === type.id)
      return oldProductType && oldProductType.name !== type.name
    })

    const productTypes = [
        ...productTypesToUpdate.map((type) => ({ ecommerceId, id: type.id, name: type.name, action: 'update' })),
        ...productTypesToAdd.map((type) => ({ ecommerceId, name: type.name, action: 'add' })),
        ...productTypesToDelete.map((type) => ({ ecommerceId, id: type.id, action: 'delete' }))
    ]

    if (!productTypes.length) {
      onClose()
      handleWarning('Nenhuma alteração foi feita, os tipos de produto estão iguais aos anteriores e o modal apenas foi fechado')
      return
    }

    await put('/product-types/multiple-update', {
      productTypes
    })

    await updateProductTypes({ cache: 'no-cache' })
    onClose()
  } catch (error) {
    console.error(error)
    handleError('Erro ao salvar tipo de produto');
  } finally {
    isLoading.value = false;
  }
}

const deleteProductType = async (id: string) => {
  newProductTypes.value = newProductTypes.value.filter((type) => type.id !== id)
};

const editProductTypeName = (index: number, value: string) => {
  newProductTypes.value[index].name = value
}

const onClose = () => {
  props.onClose();
};
</script>

<style scoped lang="scss">
.register-modal {
  .v-card {
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
}
.product-type-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.product-type-fields {
  max-height: 500px;
  overflow-y: auto;
}
</style>
