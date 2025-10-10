<template>
  <div class="homepage-config">
    <div class="page-header">
      <VBtn
        icon
        variant="text"
        @click="$router.back()"
      >
        <VIcon>mdi-arrow-left</VIcon>
      </VBtn>
      <h1>Configuração da Página Inicial</h1>
    </div>

    <AdminHomepageConfigForm />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['03-admin-auth'],
})
</script>

<style scoped lang="scss">
.homepage-config {
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
