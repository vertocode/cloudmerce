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

const { getProductTypeById } = useStoreData()

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
  max-width: 700px;
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 24px 0 12px;
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

    .vee-text-field {
      width: 100%;
      input {
        font-size: 1.1rem;
        padding: 12px 20px;
        border-radius: 8px;
        border: 1px solid #e0e0e0;
        transition: border-color 0.3s;

        &:focus {
          border-color: #007aff;
          outline: none;
        }
      }
    }

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

@media (max-width: 768px) {
  .search-bar {
    padding: 20px;

    form {
      .vee-text-field {
        input {
          font-size: 1rem;
        }
      }

      .search-btn {
        width: 45px;
        height: 45px;
        .v-icon {
          font-size: 1.4rem;
        }
      }
    }
  }
}

@media (max-width: 480px) {
  .search-bar {
    padding: 16px;

    .filter-message {
      font-size: 0.85rem;
    }

    form {
      .vee-text-field {
        input {
          font-size: 0.9rem;
          padding: 10px 16px;
        }
      }

      .search-btn {
        width: 40px;
        height: 40px;
        .v-icon {
          font-size: 1.2rem;
        }
      }
    }
  }
}
</style>
