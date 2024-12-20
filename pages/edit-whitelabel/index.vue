<template>
  <main class="edit-whitelabel">
    <header>
      <VIcon @click="$router.back()">
        mdi-arrow-left
      </VIcon>
      <h1>Edite as configurações do seu E-Commerce!</h1>
    </header>
    <MdWhitelabelConfigurationForm />
  </main>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['03-admin-auth'],
})
</script>

<style lang="scss" scoped>
header {
  margin-top: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;

  h1 {
    font-size: 1.5rem;
  }

  .v-icon {
    cursor: pointer;
  }

  @media (max-width: $mobile-breakpoint) {
    h1 {
      font-size: 1.2rem;
    }
  }
}

.edit-whitelabel {
  margin-top: 16px;
}
</style>
