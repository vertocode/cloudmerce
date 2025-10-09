<template>
  <div class="admin-pages">
    <div class="page-header">
      <h1>Páginas</h1>
      <VBtn
        color="primary"
        @click="$router.push('/admin/pages/new')"
      >
        <VIcon left>
          mdi-plus
        </VIcon>
        Criar Página
      </VBtn>
    </div>

    <VCard>
      <VCardText>
        <div
          v-if="loading"
          class="loading-container"
        >
          <VProgressCircular
            indeterminate
            color="primary"
          />
        </div>

        <div
          v-else-if="pages.length === 0"
          class="empty-state"
        >
          <VIcon
            size="64"
            color="grey"
          >
            mdi-file-document-outline
          </VIcon>
          <h3>Nenhuma página cadastrada</h3>
          <p>Crie sua primeira página customizada</p>
        </div>

        <VTable v-else>
          <thead>
            <tr>
              <th>Título</th>
              <th>Handle</th>
              <th>Seções</th>
              <th>Status</th>
              <th>Criado em</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="page in pages"
              :key="page._id"
              class="page-row"
              @click="$router.push(`/admin/pages/${page._id}/edit`)"
            >
              <td>{{ page.title }}</td>
              <td>
                <code>/pages/{{ page.handle }}</code>
              </td>
              <td>{{ page.sections.length }} seções</td>
              <td>
                <VChip
                  :color="page.isActive ? 'success' : 'error'"
                  size="small"
                >
                  {{ page.isActive ? 'Ativa' : 'Inativa' }}
                </VChip>
              </td>
              <td>{{ formatDate(page.createdAt) }}</td>
              <td>
                <div class="actions">
                  <VBtn
                    icon
                    size="small"
                    variant="text"
                    color="primary"
                    @click.stop="previewPage(page)"
                  >
                    <VIcon>mdi-eye</VIcon>
                  </VBtn>
                  <VBtn
                    icon
                    size="small"
                    variant="text"
                    @click.stop="$router.push(`/admin/pages/${page._id}/edit`)"
                  >
                    <VIcon>mdi-pencil</VIcon>
                  </VBtn>
                  <VBtn
                    icon
                    size="small"
                    variant="text"
                    color="error"
                    @click.stop="confirmDelete(page)"
                  >
                    <VIcon>mdi-delete</VIcon>
                  </VBtn>
                </div>
              </td>
            </tr>
          </tbody>
        </VTable>
      </VCardText>
    </VCard>

    <!-- Delete Confirmation Dialog -->
    <VDialog
      v-model="deleteDialog"
      max-width="500"
    >
      <VCard>
        <VCardTitle>Confirmar Exclusão</VCardTitle>
        <VCardText>
          Tem certeza que deseja excluir a página "<strong>{{ pageToDelete?.title }}</strong>"?
          Esta ação não pode ser desfeita.
        </VCardText>
        <VCardActions class="dialog-actions">
          <VBtn
            variant="text"
            @click="deleteDialog = false"
          >
            Cancelar
          </VBtn>
          <VBtn
            color="error"
            variant="flat"
            :loading="loading"
            @click="handleDelete"
          >
            Excluir
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>

<script setup lang="ts">
import type { IPage } from '~/types/page'

definePageMeta({
  layout: 'admin',
  middleware: ['03-admin-auth'],
})

const { pages, loading, fetchPages, deletePage } = usePages()
const { openSnackbar } = useSnackbar()
const router = useRouter()
const deleteDialog = ref(false)
const pageToDelete = ref<IPage | null>(null)

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

const previewPage = (page: IPage) => {
  const previewUrl = `/pages/${page.handle}`
  window.open(previewUrl, '_blank')
}

const confirmDelete = (page: IPage) => {
  pageToDelete.value = page
  deleteDialog.value = true
}

const handleDelete = async () => {
  if (!pageToDelete.value) return

  try {
    await deletePage(pageToDelete.value._id)
    openSnackbar('Página deletada com sucesso!', 'success')
    deleteDialog.value = false
    pageToDelete.value = null
  } catch (error) {
    console.error('Error deleting page:', error)
    openSnackbar('Erro ao deletar página', 'error')
  }
}

onMounted(() => {
  fetchPages()
})
</script>

<style scoped lang="scss">
.admin-pages {
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;

    h1 {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1d1d1f;
      margin: 0;
    }

    @media (max-width: 600px) {
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;

      button {
        width: 100%;
      }
    }
  }

  .loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 48px;
  }

  .empty-state {
    text-align: center;
    padding: 48px;
    color: #86868b;

    h3 {
      margin-top: 16px;
      font-size: 1.25rem;
      color: #1d1d1f;
    }

    p {
      margin-top: 8px;
    }
  }

  .page-row {
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
      background-color: #f5f5f7;
    }

    code {
      padding: 2px 6px;
      background-color: #f5f5f7;
      border-radius: 4px;
      font-size: 0.875rem;
    }

    .actions {
      display: flex;
      gap: 8px;
    }
  }

  .dialog-actions {
    justify-content: flex-end;
    gap: 12px;
  }
}
</style>
