<template>
  <Modal
      :is-opened="showRegisterModal"
      :card-props="{ title: 'Cadastrar Tipo de Produto' }"
  >
    <template #trigger>
      <div>
        <slot />
      </div>
    </template>

    <VForm fast-fail @submit.prevent="submit">
      <VeeTextField
          :value="productTypeName"
          label="Nome do Tipo de Produto"
          outlined
          required
      />

      <div v-if="isUserEverton">
        <VeeTextField
            :value="ecommerceId"
            label="ID do E-commerce"
            outlined
            required
        />
      </div>


      <VSpacer></VSpacer>

      <VRow class="ga-2" justify="end" align-content="end" no-gutters>
        <VCol cols="4">
          <VBtn variant="text" @click="onClose">
            Cancelar
          </VBtn>
        </VCol>
        <VCol cols="4">
          <VBtn variant="tonal" color="primary" width="100%" type="submit" :loading="isLoading">
            Cadastrar
          </VBtn>
        </VCol>
      </VRow>
    </VForm>
  </Modal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Modal from '~/components/El/Modal/index.vue';
import VeeTextField from "~/components/El/VeeTextField/index.vue";
import { useField, useForm } from 'vee-validate';
import {useStoreData} from "~/composables/useStoreData";

const props = defineProps<{
  showRegisterModal: boolean;
  onClose: () => void;
}>()

const isLoading = ref(false)
const { userData } = useUser()

const isUserEverton = computed(() => {
  return userData?.value?.email === 'evertonvanoni1@gmail.com'
})

const { post } = useApi()
const { updateProductTypes } = useStoreData()

const { handleSubmit } = useForm({
  initialValues: {
    productTypeName: '',
    ecommerceId: '1',
  },
  validationSchema: {
    productTypeName: (value: string) => {
      return value.length > 0 || 'O nome é obrigatório';
    },
    ecommerceId: (value: string) => {
      return value.length > 0 || 'O ID do e-commerce é obrigatório';
    },
  },
});

const productTypeName = useField('productTypeName')
const ecommerceId = useField('ecommerceId')

const submit = handleSubmit(async (values) => {
  isLoading.value = true;

  try {
    await post('/product-types', {
      name: values.productTypeName,
      ecommerceId: values.ecommerceId,
    })
    props.onClose()
    await updateProductTypes({ cache: 'no-cache' })
    handleSuccess('Tipo de produto cadastrado com sucesso!')
  } catch (error) {
    if (error instanceof Error && error.message.includes('PRODUCT_TYPE_EXISTS')) {
      handleError(`Erro: ${error.message}`)
    } else {
      handleError('Erro ao cadastrar tipo de produto')
    }
  } finally {
    isLoading.value = false;
  }
});

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
</style>
