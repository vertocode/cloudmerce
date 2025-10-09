<template>
  <div class="page-editor">
    <div class="page-header">
      <VBtn
        icon
        variant="text"
        @click="$router.back()"
      >
        <VIcon>mdi-arrow-left</VIcon>
      </VBtn>
      <h1>Criar Nova Página</h1>
    </div>

    <AdminPageEditorForm
      :initial-data="null"
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

const router = useRouter()
const { createPage } = usePages()
const { openSnackbar } = useSnackbar()

const handleSave = async (data: IPageFormData) => {
  try {
    await createPage(data)
    openSnackbar('Página criada com sucesso!', 'success')
    router.push('/admin/pages')
  } catch (error) {
    console.error('Error creating page:', error)
    openSnackbar('Erro ao criar página', 'error')
  }
}
</script>

<style scoped lang="scss">
.page-editor {
  .page-header {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 24px;

    h1 {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1d1d1f;
      margin: 0;
    }
  }
}
</style>
