<template>
  <div class="menu-config">
    <div class="page-header">
      <VBtn
        icon
        variant="text"
        @click="$router.back()"
      >
        <VIcon>mdi-arrow-left</VIcon>
      </VBtn>
      <h1>Configuração do Menu</h1>
    </div>

    <AdminMenuConfigForm />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['03-admin-auth'],
})
</script>

<style scoped lang="scss">
.menu-config {
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
