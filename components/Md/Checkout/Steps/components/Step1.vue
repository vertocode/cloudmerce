<template>
  <VeeForm>
    <VRow>
      <VCol cols="12">
        <h2 class="title">Dados Pessoais</h2>
      </VCol>
      <VCol cols="12" md="4" class="pl-0 pb-0">
        <VeeTextField required name="name" label="Nome" />
      </VCol>
      <VCol cols="12" md="4" class="pl-0 pb-0">
        <VeeTextField required name="email" label="E-mail" />
      </VCol>
      <VCol cols="12" md="4" class="pl-0 pb-0">
        <VeeTextField required name="birthday" label="Data de Nascimento" />
      </VCol>
      <VCol cols="12" md="4" class="pl-0 pb-0">
        <VeeTextField required name="phone" label="Telefone" />
      </VCol>
      <VCol cols="12" md="4" class="pl-0 pb-0">
        <VeeSelect required name="hasWhatsapp" label="Possui Whatsapp" :items="['Sim', 'Não']" />
      </VCol>
      <VCol cols="12" md="4" class="pl-0 pb-0">
        <VeeTextField required name="cpf" label="CPF" />
      </VCol>
      <VCol cols="12">
        <h2 class="title">Endereço</h2>
      </VCol>
      <VCol cols="12" md="4" class="pl-0 pb-0">
        <VeeTextField required name="cep" label="Cep" />
      </VCol>
      <VCol cols="12" md="4" class="pl-0 pb-0">
        <VeeTextField required name="state" label="Estado" />
      </VCol>
      <VCol cols="12" md="4" class="pl-0 pb-0">
        <VeeTextField required name="city" label="Cidade" />
      </VCol>
      <VCol cols="12" md="4" class="pl-0 pb-0">
        <VeeTextField required name="neighborhood" label="Bairro" />
      </VCol>
      <VCol cols="12" md="4" class="pl-0 pb-0">
        <VeeTextField required name="street" label="Rua" />
      </VCol>
      <VCol cols="12" md="4" class="pl-0 pb-0">
        <VeeTextField required name="number" label="Número" />
      </VCol>
    </VRow>
    <VBtn @click="next" class="next-button">
      Próximo
    </VBtn>
  </VeeForm>
</template>

<script setup lang="ts">
defineProps<{ next: Function }>()
</script>

<style lang="scss">

</style>
