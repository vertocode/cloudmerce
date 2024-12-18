<template>
  <div class="w-100">
    <h5 class="mt-5">
      Você deve colocar o link da imagem aqui. É possível usar qualquer serviço de armazenamento em nuvem, como
      <a href="https://imgur.com/">Imgur</a> ou outro de sua preferência.
    </h5>
    <VRow>
      <FieldArray
        v-slot="{ fields, push, remove }"
        name="imageUrls"
      >
        <VCol
          v-for="(_, index) in fields"
          :key="`image-field-${index}`"
          cols="12"
          :md="fields.length === 1 ? 12 : 6"
          class="image-field mt-0"
        >
          <VeeTextField
            :name="`imageUrls[${index}]`"
            :label="`URL da imagem ${index + 1}`"
            variant="outlined"
          />
          <VBtn
            v-if="fields.length > 1"
            icon
            class="remove-btn mb-6"
            @click="remove(index)"
          >
            <VIcon>mdi-delete</VIcon>
          </VBtn>
        </VCol>
        <VCol cols="12">
          <VBtn
            color="primary"
            class="mb-8 float-end"
            @click="push('')"
          >
            <VIcon color="white">
              mdi-plus
            </VIcon> Adicionar imagem
          </VBtn>
        </VCol>
      </FieldArray>
    </VRow>
    <VAlert
      v-if="errors?.imageUrls"
      class="mb-5"
      color="warning"
    >
      <p v-if="errors?.imageUrls">
        Adicione pelo menos uma imagem para o produto.
      </p>
    </VAlert>
  </div>
</template>

<script setup lang="ts">
import { FieldArray } from 'vee-validate'

defineProps<{
  errors: Record<string, string>
}>()
</script>
