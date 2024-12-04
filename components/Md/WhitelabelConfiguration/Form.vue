<template>
  <VeeForm :initial-values="initialValues">
    <VRow>
      <VCol
        cols="12"
        md="4"
        class="pl-0 pb-0"
      >
        <VeeTextField
          name="name"
          label="Nome da Loja"
        />
      </VCol>
      <VCol
        cols="12"
        md="4"
        class="pl-0 pb-0"
      >
        <VeeTextField
          name="baseUrl"
          label="URL do E-Commerce"
          disabled
        />
      </VCol>
      <VCol
        cols="12"
        md="4"
        class="pr-0 pb-0"
      >
        <VeeTextField
          name="logo"
          label="URL da sua logo"
        />
      </VCol>
      <VCol
        cols="12"
        class="pl-0 pb-0"
      >
        <VeeTextarea
          name="description"
          label="Descrição da sua loja"
        />
      </VCol>
      <VCol
        cols="12"
        md="6"
        class="pl-0 pb-0"
      >
        <VeeTextField
          name="bannerTitle"
          label="Título do Banner"
          outlined
        />
      </VCol>
      <VCol
        cols="12"
        md="6"
        class="pr-0 pb-0"
      >
        <VeeTextField
          name="bannerDescription"
          label="Mensagem do Banner"
          outlined
        />
      </VCol>
      <VCol
        cols="12"
        md="6"
        class="pl-0 pb-0"
      >
        <VeeColorField
          name="primaryColor"
          label="Cor Primária"
          outlined
        />
      </VCol>
      <VCol
        cols="12"
        md="6"
        class="pr-0 pb-0"
      >
        <VeeColorField
          name="secondaryColor"
          label="Cor Secundária"
          outlined
        />
      </VCol>
      <VCol cols="12">
        <VeeButton
          class="mb-5 w-100"
          variant="elevated"
          color="primary"
        >
          Salvar Configuração
        </VeeButton>
      </VCol>
    </VRow>
  </VeeForm>
</template>

<script setup lang="ts">
const initialValues = {
  baseUrl: window?.location?.origin as string,
}
</script>
