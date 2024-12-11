<template>
  <div class="search-bar">
    <VeeForm
      form-class="form"
      :validation-schema="validationSchema"
      fast-fail
      :reset-on-submit="!!filterSearchProducts"
      @submit="handleSearch"
    >
      <VeeTextField
        name="search"
        variant="outlined"
        class="vee-text-field"
        :disabled="filterSearchProducts.length"
        :label="`Buscar ${productType}`"
      />
      <VeeButton
        icon
        class="search-btn"
        :color="filterSearchProducts ? 'error' : ''"
      >
        <VIcon>{{ filterSearchProducts.length ? 'mdi-close' : 'mdi-magnify' }}</VIcon>
      </VeeButton>
    </VeeForm>
    <span
      v-if="filterSearchProducts.length"
      class="filter-message"
    >
      Filtrando por: <strong>{{ filterSearchProducts }}</strong>
      <span
        class="clean-btn"
        @click="cleanFilter"
      >Limpar filtro</span>
    </span>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'

const route = useRoute()
const filterSearchProducts = useState<string>('filterSearchProducts')

const { getProductTypeById } = useProductTypes()

const productType = computed(() => {
  const defaultProductType = 'produtos'
  const { productType } = route.params || {}
  if (!productType || Array.isArray(productType)) return defaultProductType

  const name = getProductTypeById(productType)?.name
  return name?.toLowerCase() || defaultProductType
})

const validationSchema = z.object({
  search: z.string().refine(value => !value || value.length > 3, { message: 'A busca deve ter pelo menos 3 caracteres' }),
})

const cleanFilter = () => {
  filterSearchProducts.value = ''
}

const handleSearch = async (values: { search: string }) => {
  const { search: newSearch } = values
  if (!newSearch) return

  if (newSearch === filterSearchProducts.value) {
    cleanFilter()
    return
  }

  filterSearchProducts.value = values.search
}
</script>

<style scoped lang="scss">
.search-bar {
  z-index: 3;
  width: 90%;
  max-width: 900px;
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 32px 8px 24px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);

  :deep(.form) {
    width: 100%;
    display: flex;
  }

  .filter-message {
    color: #6c757d;
    margin-top: 8px;
    font-size: 0.9rem;

    .clean-btn {
      margin-left: 4px;
      color: #007aff;
      cursor: pointer;
      text-decoration: underline;
    }
  }

  form {
    display: flex;
    align-items: center;
    width: 100%;

    .search-btn {
      background-color: #007aff;
      color: white;
      border-radius: 50%;
      width: 50px;
      height: 50px;
      margin-left: 12px;
      display: flex;
      justify-content: center;
      align-items: center;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
      transition: background-color 0.3s ease, transform 0.3s ease;

      &:hover {
        background-color: #005bb5;
        transform: scale(1.05);
      }

      .v-icon {
        font-size: 1.6rem;
        color: #fff;
      }
    }
  }
}
</style>
