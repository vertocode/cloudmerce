<template>
  <div class="superadmin-whitelabels">
    <div class="page-header">
      <h1>Gerenciar Whitelabels</h1>
      <p class="subtitle">
        Visualize e gerencie todos os whitelabels do sistema
      </p>
    </div>

    <VCard>
      <VCardText>
        <VDataTable
          :headers="headers"
          :items="whitelabels"
          :loading="loading"
          :items-per-page="10"
          class="elevation-0"
        >
          <template #item.isActive="{ item }">
            <VChip
              :color="item.isActive ? 'success' : 'error'"
              size="small"
            >
              {{ item.isActive ? 'Ativo' : 'Inativo' }}
            </VChip>
          </template>

          <template #item.createdAt="{ item }">
            {{ formatDate(item.createdAt) }}
          </template>

          <template #item.actions="{ item }">
            <VBtn
              icon
              variant="text"
              color="secondary"
              size="small"
              @click="createAdmin(item)"
            >
              <VIcon>mdi-account-plus</VIcon>
              <VTooltip activator="parent">
                Criar Usuário Admin
              </VTooltip>
            </VBtn>

            <VBtn
              icon
              variant="text"
              size="small"
              :href="item.baseUrl"
              target="_blank"
            >
              <VIcon>mdi-open-in-new</VIcon>
              <VTooltip activator="parent">
                Abrir Site
              </VTooltip>
            </VBtn>

            <VMenu>
              <template #activator="{ props }">
                <VBtn
                  icon
                  variant="text"
                  size="small"
                  v-bind="props"
                >
                  <VIcon>mdi-dots-vertical</VIcon>
                </VBtn>
              </template>

              <VList>
                <VListItem
                  @click="confirmDeleteWhitelabel(item)"
                >
                  <template #prepend>
                    <VIcon color="error">mdi-delete</VIcon>
                  </template>
                  <VListItemTitle class="text-error">
                    Deletar Whitelabel
                  </VListItemTitle>
                </VListItem>
              </VList>
            </VMenu>
          </template>
        </VDataTable>
      </VCardText>
    </VCard>

    <!-- Create Admin Dialog -->
    <VDialog
      v-model="createAdminDialog"
      max-width="500"
    >
      <VCard>
        <VCardTitle>Criar Usuário Admin</VCardTitle>
        <VCardText>
          <p class="mb-4">
            Criando admin para: <strong>{{ selectedWhitelabel?.name }}</strong>
          </p>

          <VTextField
            v-model="adminForm.name"
            label="Nome"
            required
            class="mb-3"
          />

          <VTextField
            v-model="adminForm.email"
            label="Email"
            type="email"
            required
            class="mb-3"
          />

          <VTextField
            v-model="adminForm.password"
            label="Senha"
            type="password"
            required
          />
        </VCardText>

        <VCardActions>
          <VSpacer />
          <VBtn
            variant="text"
            @click="createAdminDialog = false"
          >
            Cancelar
          </VBtn>
          <VBtn
            color="primary"
            @click="submitCreateAdmin"
            :loading="creatingAdmin"
          >
            Criar Admin
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <!-- Delete Confirmation Dialog -->
    <VDialog
      v-model="deleteDialog"
      max-width="600"
      persistent
    >
      <VCard>
        <VCardTitle class="text-error">
          <VIcon class="mr-2">mdi-alert</VIcon>
          Confirmar Exclusão
        </VCardTitle>
        <VCardText>
          <VAlert
            type="warning"
            variant="tonal"
            class="mb-4"
          >
            <strong>ATENÇÃO:</strong> Esta ação é irreversível!
          </VAlert>

          <p class="mb-4">
            Você está prestes a deletar o whitelabel: <strong>{{ whitelabelToDelete?.name }}</strong>
          </p>

          <p class="mb-4">
            Esta ação irá deletar permanentemente:
          </p>

          <ul class="mb-4">
            <li>Todas as páginas customizadas</li>
            <li>Todos os tipos de produtos</li>
            <li>Todos os produtos</li>
            <li>Todos os carrinhos</li>
            <li>Todos os pedidos</li>
            <li>Todos os usuários</li>
            <li>O whitelabel em si</li>
          </ul>

          <p class="text-error font-weight-bold">
            Digite "DELETAR" para confirmar:
          </p>

          <VTextField
            v-model="deleteConfirmText"
            placeholder="DELETAR"
            :disabled="deleting"
          />

          <div v-if="deleting" class="text-center mt-4">
            <VProgressCircular
              indeterminate
              color="error"
              size="48"
              class="mb-3"
            />
            <p class="text-body-2">
              Deletando todos os dados... Isso pode demorar alguns instantes.
            </p>
          </div>
        </VCardText>

        <VCardActions>
          <VSpacer />
          <VBtn
            variant="text"
            @click="cancelDelete"
            :disabled="deleting"
          >
            Cancelar
          </VBtn>
          <VBtn
            color="error"
            @click="executeDelete"
            :disabled="deleteConfirmText !== 'DELETAR' || deleting"
            :loading="deleting"
          >
            Deletar Permanentemente
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['03-admin-auth', 'superadmin'],
})

const { get, post, remove } = useApi()

const whitelabels = ref<any[]>([])
const loading = ref(false)
const createAdminDialog = ref(false)
const selectedWhitelabel = ref<any>(null)
const creatingAdmin = ref(false)

const deleteDialog = ref(false)
const whitelabelToDelete = ref<any>(null)
const deleteConfirmText = ref('')
const deleting = ref(false)

const adminForm = ref({
  name: '',
  email: '',
  password: '',
})

const headers = [
  { title: 'Nome', key: 'name' },
  { title: 'Base URL', key: 'baseUrl' },
  { title: 'Status', key: 'isActive' },
  { title: 'Criado em', key: 'createdAt' },
  { title: 'Ações', key: 'actions', sortable: false },
]

const fetchWhitelabels = async () => {
  loading.value = true
  try {
    const response = await get('/superadmin/whitelabels')
    whitelabels.value = response
  } catch (error) {
    console.error('Error fetching whitelabels:', error)
    handleError('Erro ao buscar whitelabels')
  } finally {
    loading.value = false
  }
}

const createAdmin = (whitelabel: any) => {
  selectedWhitelabel.value = whitelabel
  createAdminDialog.value = true
  adminForm.value = {
    name: '',
    email: '',
    password: '',
  }
}

const submitCreateAdmin = async () => {
  if (!adminForm.value.name || !adminForm.value.email || !adminForm.value.password) {
    handleWarning('Preencha todos os campos')
    return
  }

  creatingAdmin.value = true
  try {
    const response = await post('/superadmin/create-admin-user', {
      ...adminForm.value,
      whitelabelId: selectedWhitelabel.value._id,
    })

    if (response.errorCode) {
      handleError(response.error || 'Erro ao criar admin')
      return
    }

    handleSuccess('Admin criado com sucesso')
    createAdminDialog.value = false
  } catch (error) {
    console.error('Error creating admin:', error)
    handleError('Erro ao criar admin')
  } finally {
    creatingAdmin.value = false
  }
}

const confirmDeleteWhitelabel = (whitelabel: any) => {
  whitelabelToDelete.value = whitelabel
  deleteConfirmText.value = ''
  deleteDialog.value = true
}

const cancelDelete = () => {
  if (!deleting.value) {
    deleteDialog.value = false
    whitelabelToDelete.value = null
    deleteConfirmText.value = ''
  }
}

const executeDelete = async () => {
  if (deleteConfirmText.value !== 'DELETAR' || !whitelabelToDelete.value) {
    return
  }

  deleting.value = true
  try {
    const response = await remove(`/superadmin/whitelabel/${whitelabelToDelete.value._id}`)

    if (response.errorCode) {
      handleError(response.error || 'Erro ao deletar whitelabel')
      return
    }

    handleSuccess('Whitelabel e todos os dados deletados com sucesso')

    // Remove from list
    whitelabels.value = whitelabels.value.filter(
      (wl) => wl._id !== whitelabelToDelete.value._id
    )

    // Close dialog
    deleteDialog.value = false
    whitelabelToDelete.value = null
    deleteConfirmText.value = ''
  } catch (error) {
    console.error('Error deleting whitelabel:', error)
    handleError('Erro ao deletar whitelabel')
  } finally {
    deleting.value = false
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('pt-BR')
}

onMounted(() => {
  fetchWhitelabels()
})
</script>

<style scoped lang="scss">
.superadmin-whitelabels {
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 32px;

  h1 {
    font-size: 2rem;
    font-weight: 600;
    color: #1d1d1f;
    margin-bottom: 8px;
  }

  .subtitle {
    font-size: 1rem;
    color: #86868b;
  }
}
</style>
