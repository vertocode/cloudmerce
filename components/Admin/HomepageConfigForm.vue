<template>
  <VForm @submit.prevent="handleSubmit">
    <!-- Layout Selection Card -->
    <VCard class="mb-4">
      <VCardTitle>Layout da Página Inicial</VCardTitle>
      <VCardText>
        <VRadioGroup v-model="layoutType">
          <VRadio
            label="Usar layout padrão (Banner + Lista de Produtos)"
            value="default"
          />
          <VRadio
            label="Customizar layout completamente"
            value="custom"
          />
        </VRadioGroup>

        <!-- Banner Configuration (only for default layout) -->
        <div v-if="layoutType === 'default'" class="mt-6">
          <VDivider class="mb-4" />
          <h3 class="section-title mb-4">Configuração do Banner</h3>
          <VTextField
            v-model="bannerTitle"
            label="Título do Banner"
            variant="outlined"
            class="mb-4"
            :rules="[v => !!v || 'Título é obrigatório', v => (v && v.length >= 5) || 'Mínimo 5 caracteres']"
          />

          <VTextField
            v-model="bannerDescription"
            label="Descrição do Banner"
            variant="outlined"
            class="mb-4"
            :rules="[v => !!v || 'Descrição é obrigatória', v => (v && v.length >= 5) || 'Mínimo 5 caracteres']"
          />
        </div>

        <!-- Custom Layout Section Editor -->
        <div v-if="layoutType === 'custom'" class="mt-6">
          <div class="sections-header mb-4">
            <h3>Seções Customizadas</h3>
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

          <div
            v-if="sections.length === 0"
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
              v-for="(section, index) in sections"
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
                        :disabled="index === sections.length - 1"
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
        Salvar Configurações
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

            <VCard
              class="section-type-card"
              @click="selectSectionType('product-listing')"
            >
              <VCardText class="text-center">
                <VIcon
                  size="48"
                  color="primary"
                >
                  mdi-view-grid
                </VIcon>
                <h3>Lista de Produtos</h3>
                <p>Lista completa com filtros</p>
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
import type { IPageSection } from '~/types/page'
import SectionEditorDialog from '~/components/Admin/SectionEditorDialog.vue'
import BannerPreview from '~/components/Admin/SectionPreviews/BannerPreview.vue'
import ProductCarouselPreview from '~/components/Admin/SectionPreviews/ProductCarouselPreview.vue'
import RichTextPreview from '~/components/Admin/SectionPreviews/RichTextPreview.vue'
import ProductListingPreview from '~/components/Admin/SectionPreviews/ProductListingPreview.vue'

const { whitelabel } = useWhitelabel()
const { put } = useApi()
const { openSnackbar } = useSnackbar()
const router = useRouter()
const url = useRequestURL()

const loading = ref(false)

// Banner fields
const bannerTitle = ref(whitelabel.value?.banner?.title || '')
const bannerDescription = ref(whitelabel.value?.banner?.description || '')

// Layout type
const layoutType = ref<'default' | 'custom'>(
  whitelabel.value?.homepage?.useCustomLayout ? 'custom' : 'default'
)

// Sections
const sections = ref<IPageSection[]>(
  whitelabel.value?.homepage?.sections?.map((section, index) => ({
    ...section,
    id: section.id || `section-${Date.now()}-${index}`,
  })) || []
)

// Section editor state
const showAddSectionDialog = ref(false)
const showSectionEditor = ref(false)
const currentSectionType = ref<'banner' | 'product-carousel' | 'rich-text' | 'product-listing' | null>(null)
const currentSectionData = ref<IPageSection | null>(null)
const editingIndex = ref<number | null>(null)

const getSectionTypeName = (type: string) => {
  const names = {
    'banner': 'Banner',
    'product-carousel': 'Carrossel de Produtos',
    'rich-text': 'Texto Rico',
    'product-listing': 'Lista de Produtos',
  }
  return names[type as keyof typeof names] || type
}

const getSectionPreviewComponent = (type: string) => {
  const components = {
    'banner': BannerPreview,
    'product-carousel': ProductCarouselPreview,
    'rich-text': RichTextPreview,
    'product-listing': ProductListingPreview,
  }
  return components[type as keyof typeof components] || null
}

const selectSectionType = (type: 'banner' | 'product-carousel' | 'rich-text' | 'product-listing') => {
  currentSectionType.value = type
  currentSectionData.value = null
  editingIndex.value = null
  showAddSectionDialog.value = false
  showSectionEditor.value = true
}

const editSection = (index: number) => {
  const section = sections.value[index]
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
    sections.value[editingIndex.value] = sectionWithId
  } else {
    sections.value.push(sectionWithId)
  }
  showSectionEditor.value = false
  currentSectionData.value = null
  editingIndex.value = null
}

const removeSection = (index: number) => {
  sections.value.splice(index, 1)
}

const moveSection = (index: number, direction: 'up' | 'down') => {
  const newIndex = direction === 'up' ? index - 1 : index + 1
  if (newIndex < 0 || newIndex >= sections.value.length) return

  const section = sections.value[index]
  sections.value.splice(index, 1)
  sections.value.splice(newIndex, 0, section)
}

const handleSubmit = async () => {
  loading.value = true
  const id = whitelabel?.value?._id

  if (!id) {
    openSnackbar('Erro: Whitelabel não encontrado', 'error')
    loading.value = false
    return
  }

  // Check if user token exists
  const storage = makeStorage()
  const userData = storage.getItem<any>('userData')

  if (!userData?.token) {
    console.error('[Homepage Config] No token found in userData:', userData)
    openSnackbar('Sessão expirada. Por favor, faça login novamente.', 'error')
    loading.value = false
    // Redirect to login after 2 seconds
    setTimeout(() => {
      window.location.href = '/admin-setup'
    }, 2000)
    return
  }

  console.log('[Homepage Config] Token found, proceeding with update')

  try {
    const updateData = {
      banner: {
        title: bannerTitle.value,
        description: bannerDescription.value,
      },
      homepage: {
        useCustomLayout: layoutType.value === 'custom',
        sections: layoutType.value === 'custom' ? sections.value : [],
      },
    }

    const response = await put(`/whitelabel/${id}`, updateData)

    if ((response as { code: number })?.code === 200) {
      openSnackbar('Configurações da homepage salvas com sucesso!', 'success')
      // Redirect to homepage with specific cache reset parameter
      window.location.href = '/?resetHomepageCache=true'
    } else {
      throw new Error(`Response without code 200: ${response}`)
    }
  } catch (e: any) {
    console.error('[Homepage Config] Error saving:', e)

    // Check if it's an authentication error
    if (e?.status === 401 || e?.statusCode === 401) {
      openSnackbar('Sessão expirada. Por favor, faça login novamente.', 'error')
      setTimeout(() => {
        window.location.href = '/admin-setup'
      }, 2000)
    } else {
      openSnackbar('Erro ao salvar configurações', 'error')
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
.section-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #1d1d1f;
  margin: 0;
}

.sections-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;

  h3 {
    font-size: 1.2rem;
    font-weight: 600;
    margin: 0;
  }
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
