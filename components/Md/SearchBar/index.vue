<template>
  <div class="search-bar">
    <VForm fast-fail @submit.prevent="handleSearch">
      <VeeTextField
          variant="outlined"
          class="vee-text-field"
          :value="search"
          :label="`Pesquisar ${productType} pelo nome`"
          required
      />
      <VBtn
          type="submit"
          icon
          class="search-btn"
      >
        <v-icon>mdi-magnify</v-icon>
      </VBtn>
    </VForm>
  </div>
</template>

<script setup lang="ts">
import VeeTextField from "~/components/El/VeeTextField/index.vue";
import { useField, useForm } from "vee-validate";
import {useStoreData} from "~/composables/useStoreData";

const route = useRoute()
const { handleSubmit } = useForm()

const search = useField('search')

const { getProductTypeById } = useStoreData()

const productType = computed(() => {
  const defaultProductType = 'produtos'
  const { productType } = route.params || {}
  if (!productType || Array.isArray(productType)) return defaultProductType

  const name = getProductTypeById(productType)?.name

  return name?.toLowerCase() || defaultProductType
})

const handleSearch = handleSubmit((values) => {
  if (!values.search) return
  alert(`Pesquisando por: ${values.search}`)
})
</script>

<style scoped lang="scss">
.search-bar {
  max-width: 800px;
  margin: auto;
  display: flex;
  justify-content: center;
  border-radius: 16px;
  align-items: center;
  padding: 24px 12px 12px 12px;
  background-color: #f0f4f8;

  form {
    display: flex;
    align-items: flex-start;
    position: relative;
    width: 100%;
    max-width: 700px;

    .vee-text-field {
      flex-grow: 1;
    }

    .search-btn {
      background-color: var(--primary-color-500);
      border-radius: 50%;
      height: 50px;
      width: 50px;
      margin-top: 4px;
      margin-left: 1rem;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: background-color 0.3s ease, transform 0.3s ease;
      box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);

      &:hover {
        transform: scale(1.1);
        box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.3);
      }

      .v-icon {
        color: var(--secondary-color-500);
        font-size: 1.5rem;
      }
    }
  }
}
</style>
