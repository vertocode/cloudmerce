<template>
  <VDialog
    :model-value="modelValue"
    max-width="800"
    persistent
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <VCard>
      <VCardTitle>{{ title }}</VCardTitle>
      <VCardText>
        <!-- Banner Section -->
        <div v-if="sectionType === 'banner'">
          <VTextField
            v-model="formData.backgroundImage"
            label="URL da Imagem de Fundo *"
            variant="outlined"
            class="mb-4"
            required
          />
          <VTextField
            v-model="formData.title"
            label="Título (Opcional)"
            variant="outlined"
            class="mb-4"
          />
          <VTextarea
            v-model="formData.description"
            label="Descrição (Opcional)"
            variant="outlined"
            rows="3"
            class="mb-4"
          />
          <VTextField
            v-model="formData.pathname"
            label="Link de Redirecionamento (Opcional)"
            variant="outlined"
            placeholder="/about, /products, etc."
            hint="Caminho para onde o banner deve redirecionar ao ser clicado"
            persistent-hint
          />
        </div>

        <!-- Product Carousel Section -->
        <div v-if="sectionType === 'product-carousel'">
          <VTextField
            v-model="formData.title"
            label="Título (Opcional)"
            variant="outlined"
            class="mb-4"
          />
          <div class="products-selector">
            <div class="selected-products">
              <h4>Produtos Selecionados: {{ formData.productIds?.length || 0 }}</h4>
            </div>
            <VBtn
              color="primary"
              @click="showProductSelector = true"
            >
              Selecionar Produtos
            </VBtn>
          </div>
        </div>

        <!-- Rich Text Section -->
        <div v-if="sectionType === 'rich-text'">
          <label class="rich-text-label">Conteúdo *</label>
          <ClientOnly>
            <RichTextEditor
              v-model="formData.content"
              placeholder="Digite o conteúdo aqui..."
            />
            <template #fallback>
              <div class="editor-loading">Carregando editor...</div>
            </template>
          </ClientOnly>
        </div>

        <!-- Product Listing Section -->
        <div v-if="sectionType === 'product-listing'">
          <VTextField
            v-model="formData.title"
            label="Título (Opcional)"
            variant="outlined"
            class="mb-4"
          />
          <VTextField
            v-model="formData.productTypeFilter"
            label="Filtro por Tipo de Produto (Opcional)"
            variant="outlined"
            class="mb-4"
            hint="Nome do tipo de produto para filtrar"
            persistent-hint
          />
          <VTextField
            v-model="formData.searchFilter"
            label="Filtro de Busca (Opcional)"
            variant="outlined"
            hint="Termo de busca para filtrar produtos"
            persistent-hint
          />
        </div>
      </VCardText>
      <VCardActions class="actions">
        <VBtn
          variant="text"
          @click="$emit('update:modelValue', false)"
        >
          Cancelar
        </VBtn>
        <VBtn
          color="primary"
          @click="save"
        >
          Salvar
        </VBtn>
      </VCardActions>
    </VCard>

    <AdminProductSelectorModal
      v-model="showProductSelector"
      :initial-selected-ids="formData.productIds"
      @confirm="handleProductsSelected"
    />
  </VDialog>
</template>

<script setup lang="ts">
import type { IPageSection } from '~/types/page'
import AdminProductSelectorModal from './ProductSelectorModal.vue'

const props = defineProps<{
  modelValue: boolean
  sectionType: 'banner' | 'product-carousel' | 'rich-text' | 'product-listing' | null
  sectionData: IPageSection | null
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
  (event: 'save', data: IPageSection): void
}>()

const showProductSelector = ref(false)
const formData = reactive<any>({
  backgroundImage: '',
  title: '',
  description: '',
  pathname: '',
  productIds: [],
  content: '',
  productTypeFilter: '',
  searchFilter: '',
})

const title = computed(() => {
  const titles = {
    'banner': 'Configurar Banner',
    'product-carousel': 'Configurar Carrossel de Produtos',
    'rich-text': 'Configurar Texto Rico',
    'product-listing': 'Configurar Lista de Produtos',
  }
  return props.sectionType ? titles[props.sectionType] : ''
})

const handleProductsSelected = (productIds: string[]) => {
  formData.productIds = productIds
}

const save = () => {
  if (!props.sectionType) return

  const sectionData: any = {
    type: props.sectionType,
  }

  // Add only relevant fields for each section type
  if (props.sectionType === 'banner') {
    sectionData.backgroundImage = formData.backgroundImage
    if (formData.title) sectionData.title = formData.title
    if (formData.description) sectionData.description = formData.description
    if (formData.pathname) sectionData.pathname = formData.pathname
  } else if (props.sectionType === 'product-carousel') {
    if (formData.title) sectionData.title = formData.title
    sectionData.productIds = formData.productIds || []
  } else if (props.sectionType === 'rich-text') {
    sectionData.content = formData.content || ''
  } else if (props.sectionType === 'product-listing') {
    if (formData.title) sectionData.title = formData.title
    if (formData.productTypeFilter) sectionData.productTypeFilter = formData.productTypeFilter
    if (formData.searchFilter) sectionData.searchFilter = formData.searchFilter
  }

  emit('save', sectionData)
  emit('update:modelValue', false)
}

// Reset form when modal opens/closes or section type changes
watch([() => props.modelValue, () => props.sectionType], ([isOpen, type]) => {
  if (isOpen && type) {
    // Reset form data
    formData.backgroundImage = ''
    formData.title = ''
    formData.description = ''
    formData.pathname = ''
    formData.productIds = []
    formData.content = ''
    formData.productTypeFilter = ''
    formData.searchFilter = ''

    // Load existing data if editing
    if (props.sectionData) {
      Object.assign(formData, props.sectionData)
    }
  }
}, { immediate: true })
</script>

<style scoped lang="scss">
.actions {
  justify-content: flex-end;
  gap: 12px;
}

.products-selector {
  .selected-products {
    margin-bottom: 16px;

    h4 {
      font-size: 0.875rem;
      color: #86868b;
    }
  }
}

.rich-text-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 8px;
  color: rgba(0, 0, 0, 0.87);
}

.editor-loading {
  padding: 40px;
  text-align: center;
  color: #86868b;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 4px;
  background-color: #f5f5f7;
}
</style>
