<template>
  <VForm fast-fail @submit.prevent="submit">
    <div class="field-container">
      <VRow>
        <VCol cols="12" md="6" class="pl-0 pb-0">
          <VeeTextField
              :value="productName"
              label="Nome do Produto"
              outlined
              required
          />
        </VCol>

        <VCol cols="12" md="6" class="pr-0 pb-0">
          <VeeTextField
              :value="productPrice"
              prefix="R$"
              label="Preço do Produto"
              outlined
              type="number"
              required
          />
        </VCol>

        <VCol cols="12">
          <VeeTextField
              :value="productDescription"
              label="Descrição do Produto"
              outlined
              required
          />
        </VCol>

        <VCol cols="12" class="product-type-container">
          <VeeSelect
              :value="productType"
              :items="productTypes.map(type => type.name)"
              placeholder="Selecione o tipo de produto"
              label="Tipo de Produto"
              no-data-text="Sem opções, clique para cadastrar um novo tipo de produto abaixo deste input."
              outlined
              required
          />
          <span v-if="onRegisterNewProductType" class="product-type-message" @click="onRegisterNewProductType">
              Cadastrar novo tipo de produto <VIcon color="var(--secondary-700)">mdi-link</VIcon>
            </span>
        </VCol>

        <VCol
            cols="12"
            :md="imageUrls.length === 1 ? 12 : 6"
            v-for="(_, index) in imageUrls"
            :key="index"
            class="image-field mt-0"
            :class="index % 2 === 0 ? 'pl-0' : 'pr-0'"
        >
          <VTextField
              v-model="imageUrls[index]"
              :label="`URL da imagem ${index + 1}`"
              outlined
              required
          />
          <VBtn v-if="imageUrls.length > 1" color="var(--danger-color-500)" class="mb-6" icon="mdi-delete" @click="removeImageField(index)" />
        </VCol>
        <VCol cols="12">
          <VBtn  @click="addImageField" color="primary" class="mb-8 float-end">
            <VIcon color="white">mdi-plus</VIcon> Adicionar imagem
          </VBtn>
        </VCol>
      </VRow>
    </div>


    <VSpacer class="my-6"/>

    <VRow justify="end" align-content="end" no-gutters>
      <VCol cols="6">
        <VBtn size="large" variant="text" width="100%" @click="onClose">
          Cancelar
        </VBtn>
      </VCol>
      <VCol cols="6">
        <VBtn size="large" variant="tonal" color="primary" width="100%" type="submit" :loading="isLoading">
          {{ isEdition ? 'Editar' : 'Adicionar' }} Produto
        </VBtn>
      </VCol>
    </VRow>
  </VForm>
</template>
<script setup lang="ts">
import VeeSelect from "~/components/El/VeeSelect/index.vue";
import VeeTextField from "~/components/El/VeeTextField/index.vue";
import {useStoreData} from "~/composables/useStoreData";
import {useField, useForm} from "vee-validate";
import {ref} from "vue";
import type {IProductType} from "~/composables/useStoreData";

export interface InitialValues {
  productName: string
  productPrice: number
  productDescription: string
  productType: string
  imageUrls: string[]
}

interface Fields {
  productName: string;
  productPrice: number;
  productDescription: string;
  productType: string;
}

export interface ActionParams extends Fields {
  imageUrls: string[]
  productType: string
  ecommerceId: number
}

const props = defineProps<{
  action: (values: ActionParams) => Promise<void>
  onClose: () => void
  onRegisterNewProductType?: () => void
  updateProductList?: (params: { cache: 'no-cache' | 'force-cache' }) => Promise<void>
  initialValues?: InitialValues
}>()

const products = useState('products', () => [])
const { productTypes, ecommerceId } = useStoreData();

const isEdition = !!props.initialValues

const isLoading = ref(false);
const imageUrls = ref(props?.initialValues?.imageUrls || [''])

const { handleSubmit } = useForm<Fields>({
  initialValues: {
    productName: props?.initialValues?.productName || '',
    productPrice: props?.initialValues?.productPrice || 0,
    productDescription: props?.initialValues?.productDescription || '',
    productType: props?.initialValues?.productType || ''
  },
  validationSchema: {
    productName: (value: string) => value && value.length > 0 || 'O nome é obrigatório',
    productPrice: (value: number) => value && value > 0 || 'O preço deve ser maior que zero',
    productDescription: (value: string) => value && value.length > 0 || 'A descrição é obrigatória',
    productType: (value: string) => value && value.length > 0 || 'O tipo de produto é obrigatório'
  },
});

const productName = useField('productName');
const productPrice = useField('productPrice');
const productDescription = useField('productDescription');
const productType = useField('productType');

const onClose = () => {
  props.onClose();
};

const addImageField = () => {
  imageUrls.value.push('');
};

const removeImageField = (index: number) => {
  imageUrls.value.splice(index, 1);
};

const submit = handleSubmit(async (values: Fields) => {
  isLoading.value = true;

  try {
    await props.action({
      ...values,
      imageUrls: imageUrls.value,
      ecommerceId: ecommerceId,
      productType: productTypes.value.find((type: IProductType) => type.name === values.productType)?.id || ''
    })
    onClose();
    handleSuccess(`Produto ${isEdition ? 'editado' : 'adicionado'} com sucesso!`);

    // If the list has less than 20 products, update to show in the homepage
    if (products.value.length < 20 && props.updateProductList) {
      await props.updateProductList({ cache: 'no-cache' })
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes('PRODUCT_EXISTS')) {
      handleError(`Erro: ${error.message}`);
    } else {
      handleError(`Erro ao ${isEdition ? 'editar' : 'adicionar'} produto`);
    }
  } finally {
    isLoading.value = false;
  }
});
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

.image-field {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
}
</style>
