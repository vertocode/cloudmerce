<template>
  <Modal
      :is-opened="showRegisterModal"
      :card-props="{ title: 'Adicionar Produto' }"
  >
    <template #trigger>
      <div>
        <slot />
      </div>
    </template>

    <VForm fast-fail @submit.prevent="submit">
      <VeeTextField
          :value="productName"
          label="Nome do Produto"
          outlined
          required
      />

      <VeeTextField
          :value="productPrice"
          prefix="R$"
          label="Preço do Produto"
          outlined
          type="number"
          required
      />

      <VeeTextField
          :value="productDescription"
          label="Descrição do Produto"
          outlined
          required
      />

      <VeeSelect
          :value="productType"
          :items="productTypes.map(type => type.name)"
          label="Tipo de Produto"
          outlined
          required
      />

      <VSpacer />

      <VRow class="ga-2" justify="end" align-content="end" no-gutters>
        <VCol cols="4">
          <VBtn variant="text" @click="onClose">
            Cancelar
          </VBtn>
        </VCol>
        <VCol cols="4">
          <VBtn variant="tonal" color="primary" width="100%" type="submit" :loading="isLoading">
            Adicionar
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
import VeeSelect from "~/components/El/VeeSelect/index.vue";
import { useField, useForm } from 'vee-validate';
import { useApi } from '~/composables/useApi';
import {type IProductType, useStoreData} from "~/composables/useStoreData";

const props = defineProps<{
  showRegisterModal: boolean;
  onClose: () => void;
}>();

const isLoading = ref(false);
const { post } = useApi();

const { productTypes, ecommerceId } = useStoreData()

const { handleSubmit } = useForm({
  initialValues: {
    productName: '',
    productPrice: 0,
    productDescription: '',
    productType: '',
  },
  validationSchema: {
    productName: (value: string) => value.length > 0 || 'O nome é obrigatório',
    productPrice: (value: number) => value > 0 || 'O preço deve ser maior que zero',
    productDescription: (value: string) => value.length > 0 || 'A descrição é obrigatória',
    productType: (value: string) => value.length > 0 || 'O tipo de produto é obrigatório',
  },
});

const productName = useField('productName');
const productPrice = useField('productPrice');
const productDescription = useField('productDescription');
const productType = useField('productType');

const submit = handleSubmit(async (values) => {
  isLoading.value = true;

  try {
    await post('/products', {
      ecommerceId,
      name: values.productName,
      price: values.productPrice,
      description: values.productDescription,
      productType: productTypes.value.find((type: IProductType) => type.name === values.productType)?.id,
    })
    props.onClose();
    handleSuccess('Produto adicionado com sucesso!');
  } catch (error) {
    if (error instanceof Error && error.message.includes('PRODUCT_EXISTS')) {
      handleError(`Erro: ${error.message}`);
    } else {
      handleError('Erro ao adicionar produto');
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
.add-product-modal {
  .v-card {
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
}
</style>
