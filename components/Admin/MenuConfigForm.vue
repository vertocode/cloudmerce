<template>
  <VForm @submit.prevent="handleSubmit">
    <!-- Menu Configuration Card -->
    <VCard class="mb-4">
      <VCardTitle>Configuração do Menu</VCardTitle>
      <VCardText>
        <VRadioGroup v-model="menuType">
          <VRadio
            label="Usar menu padrão"
            value="default"
          />
          <VRadio
            label="Customizar menu completamente"
            value="custom"
          />
        </VRadioGroup>

        <!-- Custom Menu Configuration -->
        <div v-if="menuType === 'custom'" class="mt-6">
          <VDivider class="mb-6" />

          <!-- Navigation Items -->
          <div class="menu-section mb-8">
            <div class="section-header mb-4">
              <h3>Itens de Navegação</h3>
              <VBtn
                color="primary"
                size="small"
                @click="addNavigationItem"
              >
                <VIcon left>mdi-plus</VIcon>
                Adicionar Item
              </VBtn>
            </div>

            <div v-if="navigationItems.length === 0" class="empty-state">
              <VIcon size="48" color="grey">mdi-navigation</VIcon>
              <p>Nenhum item de navegação. Clique em "Adicionar Item" para começar.</p>
            </div>

            <div v-else class="items-list">
              <VCard
                v-for="(item, index) in navigationItems"
                :key="index"
                class="item-card mb-3"
              >
                <VCardText>
                  <div class="item-header">
                    <VIcon class="drag-handle">mdi-drag</VIcon>
                    <VChip size="small">Item {{ index + 1 }}</VChip>
                    <div class="item-actions">
                      <VBtn
                        icon
                        size="small"
                        variant="text"
                        @click="moveItem(navigationItems, index, 'up')"
                        :disabled="index === 0"
                      >
                        <VIcon>mdi-arrow-up</VIcon>
                      </VBtn>
                      <VBtn
                        icon
                        size="small"
                        variant="text"
                        @click="moveItem(navigationItems, index, 'down')"
                        :disabled="index === navigationItems.length - 1"
                      >
                        <VIcon>mdi-arrow-down</VIcon>
                      </VBtn>
                      <VBtn
                        icon
                        size="small"
                        variant="text"
                        color="error"
                        @click="removeNavigationItem(index)"
                      >
                        <VIcon>mdi-delete</VIcon>
                      </VBtn>
                    </div>
                  </div>

                  <VTextField
                    v-model="item.label"
                    label="Texto do Item *"
                    variant="outlined"
                    class="mt-4 mb-3"
                    dense
                  />

                  <VTextField
                    v-model="item.link"
                    label="Link (Opcional se tiver filhos)"
                    variant="outlined"
                    placeholder="/produtos, /sobre, etc."
                    class="mb-3"
                    dense
                    hint="Deixe vazio se o item tiver subitens"
                    persistent-hint
                  />

                  <!-- Child Items -->
                  <div class="children-section mt-4">
                    <div class="children-header">
                      <h4>Subitens (Menu Dropdown)</h4>
                      <VBtn
                        size="x-small"
                        variant="outlined"
                        @click="addChildItem(index)"
                      >
                        <VIcon left size="small">mdi-plus</VIcon>
                        Adicionar Subitem
                      </VBtn>
                    </div>

                    <div v-if="!item.children || item.children.length === 0" class="empty-children">
                      <p>Nenhum subitem</p>
                    </div>

                    <div v-else class="children-list">
                      <div
                        v-for="(child, childIndex) in item.children"
                        :key="childIndex"
                        class="child-item"
                      >
                        <VTextField
                          v-model="child.label"
                          label="Texto *"
                          variant="outlined"
                          density="compact"
                          class="mb-2"
                        />
                        <div class="child-row">
                          <VTextField
                            v-model="child.link"
                            label="Link *"
                            variant="outlined"
                            density="compact"
                            placeholder="/link"
                            style="flex: 1"
                          />
                          <VBtn
                            icon
                            size="small"
                            variant="text"
                            color="error"
                            @click="removeChildItem(index, childIndex)"
                          >
                            <VIcon>mdi-delete</VIcon>
                          </VBtn>
                        </div>
                      </div>
                    </div>
                  </div>
                </VCardText>
              </VCard>
            </div>
          </div>

          <VDivider class="my-6" />

          <!-- Dropdown Menu Items -->
          <div class="menu-section">
            <div class="section-header mb-4">
              <h3>Itens do Menu Dropdown (Hamburguer)</h3>
              <VBtn
                color="primary"
                size="small"
                @click="addDropdownItem"
              >
                <VIcon left>mdi-plus</VIcon>
                Adicionar Item
              </VBtn>
            </div>

            <div v-if="dropdownItems.length === 0" class="empty-state">
              <VIcon size="48" color="grey">mdi-menu</VIcon>
              <p>Nenhum item no menu dropdown. Clique em "Adicionar Item" para começar.</p>
            </div>

            <div v-else class="items-list">
              <VCard
                v-for="(item, index) in dropdownItems"
                :key="index"
                class="item-card mb-3"
              >
                <VCardText>
                  <div class="item-header">
                    <VIcon class="drag-handle">mdi-drag</VIcon>
                    <VChip size="small">Item {{ index + 1 }}</VChip>
                    <div class="item-actions">
                      <VBtn
                        icon
                        size="small"
                        variant="text"
                        @click="moveItem(dropdownItems, index, 'up')"
                        :disabled="index === 0"
                      >
                        <VIcon>mdi-arrow-up</VIcon>
                      </VBtn>
                      <VBtn
                        icon
                        size="small"
                        variant="text"
                        @click="moveItem(dropdownItems, index, 'down')"
                        :disabled="index === dropdownItems.length - 1"
                      >
                        <VIcon>mdi-arrow-down</VIcon>
                      </VBtn>
                      <VBtn
                        icon
                        size="small"
                        variant="text"
                        color="error"
                        @click="removeDropdownItem(index)"
                      >
                        <VIcon>mdi-delete</VIcon>
                      </VBtn>
                    </div>
                  </div>

                  <VTextField
                    v-model="item.label"
                    label="Texto do Item *"
                    variant="outlined"
                    class="mt-4 mb-3"
                    dense
                  />

                  <VTextField
                    v-model="item.link"
                    label="Link *"
                    variant="outlined"
                    placeholder="/produtos, /sobre, etc."
                    class="mb-3"
                    dense
                  />

                  <VSelect
                    v-model="item.visibleOn"
                    label="Visível Em *"
                    :items="visibilityOptions"
                    variant="outlined"
                    dense
                  />
                </VCardText>
              </VCard>
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
  </VForm>
</template>

<script setup lang="ts">
import type { IMenuNavigationItem, IMenuDropdownItem, IMenuChildItem } from '~/types/whitelabel'

const { whitelabel } = useWhitelabel()
const { put } = useApi()
const { openSnackbar } = useSnackbar()

const loading = ref(false)

// Menu type
const menuType = ref<'default' | 'custom'>(
  whitelabel.value?.menu?.useCustomMenu ? 'custom' : 'default'
)

// Navigation items
const navigationItems = ref<IMenuNavigationItem[]>(
  whitelabel.value?.menu?.navigationItems || []
)

// Dropdown items
const dropdownItems = ref<IMenuDropdownItem[]>(
  whitelabel.value?.menu?.dropdownItems || []
)

const visibilityOptions = [
  { title: 'Desktop e Mobile', value: 'both' },
  { title: 'Apenas Desktop', value: 'desktop' },
  { title: 'Apenas Mobile', value: 'mobile' },
]

// Navigation Items Methods
const addNavigationItem = () => {
  navigationItems.value.push({
    label: '',
    link: '',
    children: [],
  })
}

const removeNavigationItem = (index: number) => {
  navigationItems.value.splice(index, 1)
}

const addChildItem = (parentIndex: number) => {
  if (!navigationItems.value[parentIndex].children) {
    navigationItems.value[parentIndex].children = []
  }
  navigationItems.value[parentIndex].children!.push({
    label: '',
    link: '',
  })
}

const removeChildItem = (parentIndex: number, childIndex: number) => {
  navigationItems.value[parentIndex].children!.splice(childIndex, 1)
}

// Dropdown Items Methods
const addDropdownItem = () => {
  dropdownItems.value.push({
    label: '',
    link: '',
    visibleOn: 'both',
  })
}

const removeDropdownItem = (index: number) => {
  dropdownItems.value.splice(index, 1)
}

// Generic move method
const moveItem = (array: any[], index: number, direction: 'up' | 'down') => {
  const newIndex = direction === 'up' ? index - 1 : index + 1
  if (newIndex < 0 || newIndex >= array.length) return

  const item = array[index]
  array.splice(index, 1)
  array.splice(newIndex, 0, item)
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
    console.error('[Menu Config] No token found in userData:', userData)
    openSnackbar('Sessão expirada. Por favor, faça login novamente.', 'error')
    loading.value = false
    setTimeout(() => {
      window.location.href = '/admin-setup'
    }, 2000)
    return
  }

  console.log('[Menu Config] Token found, proceeding with update')

  try {
    const updateData = {
      menu: {
        useCustomMenu: menuType.value === 'custom',
        navigationItems: menuType.value === 'custom' ? navigationItems.value.filter(item => item.label) : [],
        dropdownItems: menuType.value === 'custom' ? dropdownItems.value.filter(item => item.label && item.link) : [],
      },
    }

    const response = await put(`/whitelabel/${id}`, updateData)

    if ((response as { code: number })?.code === 200) {
      openSnackbar('Configurações do menu salvas com sucesso!', 'success')
      // Redirect to home with cache reset
      window.location.href = '/?resetCache=true'
    } else {
      throw new Error(`Response without code 200: ${response}`)
    }
  } catch (e: any) {
    console.error('[Menu Config] Error saving:', e)

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
.menu-section {
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    h3 {
      font-size: 1.2rem;
      font-weight: 600;
      margin: 0;
      color: #1d1d1f;
    }
  }
}

.empty-state {
  text-align: center;
  padding: 48px;
  color: #86868b;

  p {
    margin-top: 16px;
  }
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.item-card {
  border: 1px solid rgba(0, 0, 0, 0.12);
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .item-header {
    display: flex;
    align-items: center;
    gap: 12px;

    .drag-handle {
      color: #86868b;
      cursor: grab;
    }

    .item-actions {
      margin-left: auto;
      display: flex;
      gap: 4px;
    }
  }
}

.children-section {
  background-color: #f5f5f7;
  padding: 16px;
  border-radius: 8px;

  .children-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;

    h4 {
      font-size: 0.9rem;
      font-weight: 600;
      margin: 0;
      color: #1d1d1f;
    }
  }

  .empty-children {
    text-align: center;
    padding: 16px;
    color: #86868b;
    font-size: 0.875rem;

    p {
      margin: 0;
    }
  }

  .children-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .child-item {
    background-color: white;
    padding: 12px;
    border-radius: 6px;
    border: 1px solid rgba(0, 0, 0, 0.08);

    .child-row {
      display: flex;
      gap: 8px;
      align-items: center;
    }
  }
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}
</style>
