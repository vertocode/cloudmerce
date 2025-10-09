<template>
  <VForm @submit.prevent="handleSubmit">
    <VCard class="mb-4">
      <VCardTitle>Informações Básicas</VCardTitle>
      <VCardText>
        <VTextField
          v-model="formData.title"
          label="Título da Página"
          required
          variant="outlined"
          class="mb-4"
        />

        <VTextField
          v-model="formData.handle"
          label="Handle (URL)"
          hint="Ex: sobre-nos (será acessível em /pages/sobre-nos)"
          persistent-hint
          required
          variant="outlined"
          class="mb-4"
        />

        <VSwitch
          v-model="formData.isActive"
          label="Página Ativa"
          color="primary"
        />
      </VCardText>
    </VCard>

    <VCard class="mb-4">
      <VCardTitle>
        <div class="sections-header">
          <span>Seções</span>
          <VBtn
            color="primary"
            size="small"
            @click="showAddSectionDialog = true"
          >
            <VIcon left>
              mdi-plus
            </VIcon>
            Adicionar Seção
          </VBtn>
        </div>
      </VCardTitle>
      <VCardText>
        <div
          v-if="formData.sections.length === 0"
          class="empty-sections"
        >
          <VIcon
            size="48"
            color="grey"
          >
            mdi-view-module-outline
          </VIcon>
          <p>Nenhuma seção adicionada. Clique em "Adicionar Seção" para começar.</p>
        </div>

        <div class="sections-list-wrapper">
          <div
            v-for="(section, index) in formData.sections"
            :key="section.id || index"
            class="section-wrapper"
          >
            <div class="section-card">
              <div class="section-content">
                <div class="section-header">
                  <div class="drag-handle">
                    <VIcon>mdi-menu</VIcon>
                  </div>
                  <VChip size="small">
                    {{ getSectionTypeName(section.type) }}
                  </VChip>
                  <div class="section-actions">
                    <VBtn
                      icon
                      size="small"
                      variant="text"
                      @click="moveSection(index, 'up')"
                      :disabled="index === 0"
                    >
                      <VIcon>mdi-arrow-up</VIcon>
                    </VBtn>
                    <VBtn
                      icon
                      size="small"
                      variant="text"
                      @click="moveSection(index, 'down')"
                      :disabled="index === formData.sections.length - 1"
                    >
                      <VIcon>mdi-arrow-down</VIcon>
                    </VBtn>
                    <VBtn
                      icon
                      size="small"
                      variant="text"
                      @click="editSection(index)"
                    >
                      <VIcon>mdi-pencil</VIcon>
                    </VBtn>
                    <VBtn
                      icon
                      size="small"
                      variant="text"
                      color="error"
                      @click="removeSection(index)"
                    >
                      <VIcon>mdi-delete</VIcon>
                    </VBtn>
                  </div>
                </div>
                <div class="section-preview">
                  <component
                    :is="getSectionPreviewComponent(section.type)"
                    :section="section"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </VCardText>
    </VCard>

    <div class="form-actions">
      <VBtn
        variant="outlined"
        @click="$router.back()"
      >
        Cancelar
      </VBtn>
      <VBtn
        type="submit"
        color="primary"
        :loading="loading"
      >
        Salvar Página
      </VBtn>
    </div>

    <!-- Add Section Dialog -->
    <VDialog
      v-model="showAddSectionDialog"
      max-width="600"
    >
      <VCard>
        <VCardTitle>Adicionar Seção</VCardTitle>
        <VCardText>
          <div class="section-types">
            <VCard
              class="section-type-card"
              @click="selectSectionType('banner')"
            >
              <VCardText class="text-center">
                <VIcon
                  size="48"
                  color="primary"
                >
                  mdi-image
                </VIcon>
                <h3>Banner</h3>
                <p>Imagem de fundo com título e descrição</p>
              </VCardText>
            </VCard>

            <VCard
              class="section-type-card"
              @click="selectSectionType('product-carousel')"
            >
              <VCardText class="text-center">
                <VIcon
                  size="48"
                  color="primary"
                >
                  mdi-view-carousel
                </VIcon>
                <h3>Carrossel de Produtos</h3>
                <p>Exiba produtos selecionados</p>
              </VCardText>
            </VCard>

            <VCard
              class="section-type-card"
              @click="selectSectionType('rich-text')"
            >
              <VCardText class="text-center">
                <VIcon
                  size="48"
                  color="primary"
                >
                  mdi-text-box
                </VIcon>
                <h3>Texto Rico</h3>
                <p>Conteúdo de texto formatado</p>
              </VCardText>
            </VCard>
          </div>
        </VCardText>
      </VCard>
    </VDialog>

    <!-- Section Editor Dialog -->
    <SectionEditorDialog
      v-model="showSectionEditor"
      :section-type="currentSectionType"
      :section-data="currentSectionData"
      @save="saveSection"
    />
  </VForm>
</template>

<script setup lang="ts">
import type { IPageFormData, IPageSection } from '~/types/page'
import type { IPage } from '~/types/page'
import SectionEditorDialog from './SectionEditorDialog.vue'
import BannerPreview from './SectionPreviews/BannerPreview.vue'
import ProductCarouselPreview from './SectionPreviews/ProductCarouselPreview.vue'
import RichTextPreview from './SectionPreviews/RichTextPreview.vue'

const props = defineProps<{
  initialData: IPage | null
}>()

const emit = defineEmits<{
  (event: 'save', data: IPageFormData): void
}>()

const loading = ref(false)
const showAddSectionDialog = ref(false)
const showSectionEditor = ref(false)
const currentSectionType = ref<'banner' | 'product-carousel' | 'rich-text' | null>(null)
const currentSectionData = ref<IPageSection | null>(null)
const editingIndex = ref<number | null>(null)

const formData = reactive<IPageFormData>({
  title: props.initialData?.title || '',
  handle: props.initialData?.handle || '',
  sections: props.initialData?.sections?.map((section, index) => ({
    ...section,
    id: section.id || `section-${Date.now()}-${index}`,
  })) || [],
  isActive: props.initialData?.isActive !== undefined ? props.initialData.isActive : true,
})

const getSectionTypeName = (type: string) => {
  const names = {
    'banner': 'Banner',
    'product-carousel': 'Carrossel de Produtos',
    'rich-text': 'Texto Rico',
  }
  return names[type as keyof typeof names] || type
}

const getSectionPreviewComponent = (type: string) => {
  const components = {
    'banner': BannerPreview,
    'product-carousel': ProductCarouselPreview,
    'rich-text': RichTextPreview,
  }
  return components[type as keyof typeof components] || null
}

const selectSectionType = (type: 'banner' | 'product-carousel' | 'rich-text') => {
  currentSectionType.value = type
  currentSectionData.value = null
  editingIndex.value = null
  showAddSectionDialog.value = false
  showSectionEditor.value = true
}

const editSection = (index: number) => {
  const section = formData.sections[index]
  currentSectionType.value = section.type as any
  currentSectionData.value = section
  editingIndex.value = index
  showSectionEditor.value = true
}

const saveSection = (sectionData: IPageSection) => {
  const sectionWithId = {
    ...sectionData,
    id: sectionData.id || `section-${Date.now()}`,
  }

  if (editingIndex.value !== null) {
    formData.sections[editingIndex.value] = sectionWithId
  } else {
    formData.sections.push(sectionWithId)
  }
  showSectionEditor.value = false
  currentSectionData.value = null
  editingIndex.value = null
}

const removeSection = (index: number) => {
  formData.sections.splice(index, 1)
}

const moveSection = (index: number, direction: 'up' | 'down') => {
  const newIndex = direction === 'up' ? index - 1 : index + 1
  if (newIndex < 0 || newIndex >= formData.sections.length) return

  const section = formData.sections[index]
  formData.sections.splice(index, 1)
  formData.sections.splice(newIndex, 0, section)
}

const handleSubmit = () => {
  loading.value = true
  emit('save', formData)
  loading.value = false
}

// Watch for changes in initialData and update formData
watch(() => props.initialData, (newData) => {
  if (newData) {
    formData.title = newData.title
    formData.handle = newData.handle
    formData.sections = newData.sections?.map((section, index) => ({
      ...section,
      id: section.id || `section-${Date.now()}-${index}`,
    })) || []
    formData.isActive = newData.isActive
  }
}, { immediate: true })
</script>

<style scoped lang="scss">
.sections-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.empty-sections {
  text-align: center;
  padding: 48px;
  color: #86868b;

  p {
    margin-top: 16px;
  }
}

.sections-list-wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-wrapper {
  width: 100%;
}

.section-card {
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 8px;
  background-color: white;
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .section-content {
    padding: 16px;
  }

  .section-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;

    .drag-handle {
      color: #86868b;
      display: flex;
      align-items: center;
      padding: 4px;
    }

    .section-actions {
      margin-left: auto;
      display: flex;
      gap: 8px;
    }
  }

  .section-preview {
    padding: 16px;
    background-color: #f5f5f7;
    border-radius: 8px;
  }
}

.section-types {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
}

.section-type-card {
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }

  h3 {
    margin: 12px 0 8px;
    font-size: 1rem;
    font-weight: 600;
  }

  p {
    font-size: 0.875rem;
    color: #86868b;
    margin: 0;
  }
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}
</style>
