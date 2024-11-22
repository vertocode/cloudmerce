<template>
  <VeeForm>
    <VRow>
      <VCol cols="12">
        <h2 class="title">Dados Pessoais</h2>
      </VCol>
      <VCol cols="12" md="4" class="pl-0 pb-0">
        <VeeTextField required name="name" label="Nome" placeholder="Digite o seu nome completo" />
      </VCol>
      <VCol cols="12" md="4" class="pl-0 pb-0">
        <VeeTextField required name="email" label="E-mail" placeholder="Digite o seu e-mail para contato" />
      </VCol>
      <VCol cols="12" md="4" class="pl-0 pb-0">
        <VeeTextField required name="birthday" label="Data de Nascimento" placeholder="Digite a sua data de nascimento" />
      </VCol>
      <VCol cols="12" md="4" class="pl-0 pb-0">
        <VeeTextField required name="phone" label="Telefone" placeholder="Digite o seu telefone para contato" />
      </VCol>
      <VCol cols="12" md="4" class="pl-0 pb-0">
        <VeeSelect required name="hasWhatsapp" label="Possui Whatsapp" :items="['Sim', 'Não']" />
      </VCol>
      <VCol cols="12" md="4" class="pl-0 pb-0">
        <VeeTextField required name="cpf" label="CPF" placeholder="Digite o seu CPF" />
      </VCol>
      <VCol cols="12">
        <h2 class="title">Endereço</h2>
      </VCol>
      <VCol cols="12" md="4" class="pl-0 pb-0">
        <VeeTextField required name="cep" label="Cep" placeholder="Digite o CEP para envio" />
      </VCol>
      <VCol cols="12" md="4" class="pl-0 pb-0">
        <VeeTextField required name="state" label="Estado" placeholder="Digite o estado para envio" />
      </VCol>
      <VCol cols="12" md="4" class="pl-0 pb-0">
        <VeeTextField required name="city" label="Cidade" placeholder="Digite a cidade para envio" />
      </VCol>
      <VCol cols="12" md="4" class="pl-0 pb-0">
        <VeeTextField required name="neighborhood" label="Bairro" placeholder="Digite o bairro para envio" />
      </VCol>
      <VCol cols="12" md="4" class="pl-0 pb-0">
        <VeeTextField required name="street" label="Rua" placeholder="Digite a rua para envio"/>
      </VCol>
      <VCol cols="12" md="4" class="pl-0 pb-0">
        <VeeTextField required name="number" label="Número" placeholder="Digite o número para envio"/>
      </VCol>
    </VRow>
    <VBtn @click="next" class="next-button" append-icon="mdi-arrow-right">
      Próximo
    </VBtn>
  </VeeForm>
</template>

<script setup lang="ts">
defineProps<{ next: Function }>()
</script>

<style lang="scss">

</style>
