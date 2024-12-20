<template>
  <div class="search-bar">
    <VeeForm
      v-slot="{ ...attrs }"
      form-class="vee-form"
      fast-fail
      :reset-on-submit="!!filterSearchProducts"
      @submit="handleSearch"
    >
      <section class="form">
        <VeeTextField
          name="search"
          variant="outlined"
          class="search"
          :disabled="filterSearchProducts.length"
          :label="`Buscar ${productType}`"
        />
        <VeeButton
          icon
          class="search-btn"
          :color="filterSearchProducts ? 'error' : 'primary'"
        >
          <VIcon>{{ filterSearchProducts.length ? 'mdi-close' : 'mdi-magnify' }}</VIcon>
        </VeeButton>
      </section>
      <span
        v-if="filterSearchProducts.length"
        class="filter-message"
      >
        Filtrando por: <strong>{{ filterSearchProducts }}</strong>
        <span
          class="clean-btn"
          @click="cleanFilter({ resetForm: attrs.resetForm })"
        >Limpar filtro</span>
      </span>
    </VeeForm>
  </div>
</template>

<script setup lang="ts">
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

const cleanFilter = ({ resetForm }: { resetForm: VoidFunction }) => {
  console.log(resetForm, '<<< resetForm')
  filterSearchProducts.value = ''
  resetForm()
}

const handleSearch = async (values: { search: string }, { resetForm }: { resetForm: VoidFunction }) => {
  const { search: newSearch } = values
  if (!newSearch) return

  if (newSearch === filterSearchProducts.value) {
    cleanFilter({ resetForm })
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

  :deep(.vee-form) {
    width: 100%;
  }

  .form {
    display: flex;
  }

  .search {
    border-radius: 12px;
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
      margin-top: 4px;
      color: white;
      width: 50px;
      height: 50px;
      margin-left: 12px;
      display: flex;
      justify-content: center;
      align-items: center;
      background: linear-gradient(86.28deg, var(--secondary-color-500) 10.21%, var(--secondary-color-500) 42.99%, var(--secondary-color-500) 56.02%, var(--primary-color-500) 157.2%);
      transition: background-color 0.3s ease, transform 0.3s ease;

      &:hover {
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
