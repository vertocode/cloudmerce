<template>
  <div class="admin-settings">
    <div class="page-header">
      <h1>Configurações</h1>
      <p class="subtitle">
        Configure as informações e aparência da sua loja
      </p>
    </div>

    <div class="settings-sections">
      <VCard
        class="settings-card"
        @click="$router.push('/admin/pages')"
      >
        <VCardText>
          <div class="settings-icon">
            <VIcon
              size="48"
              color="primary"
            >
              mdi-file-document-multiple
            </VIcon>
          </div>
          <h2>Páginas</h2>
          <p>Gerencie páginas customizadas do seu e-commerce</p>
        </VCardText>
      </VCard>

      <VCard
        class="settings-card"
        @click="$router.push('/admin/homepage')"
      >
        <VCardText>
          <div class="settings-icon">
            <VIcon
              size="48"
              color="primary"
            >
              mdi-home-variant
            </VIcon>
          </div>
          <h2>Página Inicial</h2>
          <p>Configure o layout e conteúdo da homepage</p>
        </VCardText>
      </VCard>

      <VCard
        class="settings-card"
        @click="showWhitelabelForm = true"
      >
        <VCardText>
          <div class="settings-icon">
            <VIcon
              size="48"
              color="primary"
            >
              mdi-store-cog
            </VIcon>
          </div>
          <h2>Configurações da Loja</h2>
          <p>Configure informações básicas e aparência</p>
        </VCardText>
      </VCard>

      <VCard
        class="settings-card"
        @click="$router.push('/admin/financeiro')"
      >
        <VCardText>
          <div class="settings-icon">
            <VIcon
              size="48"
              color="success"
            >
              mdi-cash-multiple
            </VIcon>
          </div>
          <h2>Financeiro</h2>
          <p>Configure sua conta do Mercado Pago para receber pagamentos</p>
        </VCardText>
      </VCard>
    </div>

    <VDialog
      v-model="showWhitelabelForm"
      max-width="900"
      scrollable
    >
      <VCard>
        <VCardTitle>
          <div class="dialog-header">
            <span>Configurações da Loja</span>
            <VBtn
              icon
              variant="text"
              @click="showWhitelabelForm = false"
            >
              <VIcon>mdi-close</VIcon>
            </VBtn>
          </div>
        </VCardTitle>
        <VCardText>
          <MdWhitelabelConfigurationForm @saved="showWhitelabelForm = false" />
        </VCardText>
      </VCard>
    </VDialog>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['03-admin-auth'],
})

const route = useRoute()
const router = useRouter()
const showWhitelabelForm = ref(false)

// Check if we should open the whitelabel modal from query parameter
onMounted(() => {
  if (route.query.openWhitelabelModal === 'true') {
    showWhitelabelForm.value = true
    // Remove the query parameter from the URL
    router.replace({ query: {} })
  }
})
</script>

<style scoped lang="scss">
.admin-settings {
  .page-header {
    margin-bottom: 32px;

    h1 {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1d1d1f;
      margin: 0 0 8px 0;
    }

    .subtitle {
      font-size: 0.875rem;
      color: #86868b;
      margin: 0;
    }
  }

  .settings-sections {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 24px;
  }

  .settings-card {
    cursor: pointer;
    transition: all 0.3s ease;
    border: 2px solid transparent;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
      border-color: var(--primary-color);
    }

    .settings-icon {
      text-align: center;
      margin-bottom: 16px;
    }

    h2 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1d1d1f;
      margin: 0 0 8px 0;
      text-align: center;
    }

    p {
      font-size: 0.875rem;
      color: #86868b;
      margin: 0;
      text-align: center;
    }
  }

  .dialog-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }
}
</style>
