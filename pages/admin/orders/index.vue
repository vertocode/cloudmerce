<template>
  <div class="admin-orders">
    <div class="page-header">
      <h1>Todos os Pedidos</h1>
    </div>

    <VCard>
      <VCardText>
        <MdAllOrders />
      </VCardText>
    </VCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['03-admin-auth'],
})
</script>

<style scoped lang="scss">
.admin-orders {
  .page-header {
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
