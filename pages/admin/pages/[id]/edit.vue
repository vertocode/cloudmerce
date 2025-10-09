<template>
  <div class="admin-page-edit">
    <div class="page-header">
      <h1>{{ isNew ? 'Criar Página' : 'Editar Página' }}</h1>
    </div>

    <div
      v-if="loading"
      class="loading-container"
    >
      <VProgressCircular
        indeterminate
        color="primary"
      />
    </div>

    <AdminPageEditorForm
      v-else
      :initial-data="page"
      @save="handleSave"
    />
  </div>
</template>

<script setup lang="ts">
import type { IPageFormData } from '~/types/page'
import AdminPageEditorForm from '~/components/Admin/PageEditorForm.vue'

definePageMeta({
  layout: 'admin',
  middleware: ['03-admin-auth'],
})

const route = useRoute()
const router = useRouter()
const { getPageById, updatePage } = usePages()
const { openSnackbar } = useSnackbar()

const pageId = computed(() => route.params.id as string)
const isNew = computed(() => pageId.value === 'new')
const page = ref(null)
const loading = ref(false)

const handleSave = async (data: IPageFormData) => {
  try {
    loading.value = true
    await updatePage(pageId.value, data)

    openSnackbar('Página salva com sucesso!', 'success')
    router.push('/admin/pages')
  } catch (error) {
    console.error('Error saving page:', error)
    openSnackbar('Erro ao salvar página', 'error')
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  if (!isNew.value) {
    loading.value = true
    page.value = await getPageById(pageId.value)
    loading.value = false
  }
})
</script>

<style scoped lang="scss">
.admin-page-edit {
  .page-header {
    margin-bottom: 24px;

    h1 {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1d1d1f;
      margin: 0;
    }
  }

  .loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 48px;
  }
}
</style>
