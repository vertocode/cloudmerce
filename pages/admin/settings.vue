<template>
  <div class="admin-settings">
    <div class="page-header">
      <h1>Configurações do E-Commerce</h1>
      <p class="subtitle">
        Configure as informações e aparência da sua loja
      </p>
    </div>

    <MdWhitelabelConfigurationForm />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['03-admin-auth'],
})
</script>

<style scoped lang="scss">
.admin-settings {
  .page-header {
    margin-bottom: 24px;

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
}
</style>
