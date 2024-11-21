<template>
  <VeeForm>
    <VRow>
      <VCol cols="12">
        <h2 class="title">Dados de Pagamento</h2>
      </VCol>
      <VCol cols="12" md="6" class="pl-0 pb-0">
        <VeeTextField required name="number" label="Nome no Cartão" />
      </VCol>
      <VCol cols="12" md="6" class="pl-0 pb-0">
        <VeeTextField required name="number" label="CPF do Titular do Cartão" />
      </VCol>
      <VCol cols="12" md="6" class="pl-0 pb-0">
        <VeeTextField required name="number" label="Número do Cartão" />
      </VCol>
      <VCol cols="12" md="4" class="pl-0 pb-0">
        <VeeTextField required name="expDate" label="Data de Expiração" />
      </VCol>
      <VCol cols="12" md="2" class="pl-0 pb-0">
        <VeeTextField required name="cvc" label="CVC" />
      </VCol>
    </VRow>
    <VBtn @click="next" class="next-button">
      Processar Pagamento
    </VBtn>
  </VeeForm>
</template>

<script setup lang="ts">
defineProps<{ next: Function }>()
</script>

<style lang="scss">

</style>
