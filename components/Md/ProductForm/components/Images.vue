<template>
  <Card class="images">
    <h3>Adicionar imagens para o produto</h3>
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
          <VeeFile
            :name="`imageUrls[${index}]`"
            :label="`URL da imagem ${index + 1}`"
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
  </Card>
</template>

<script setup lang="ts">
import { FieldArray } from 'vee-validate'
import Card from '~/components/Md/ProductForm/components/Card.vue'

defineProps<{
  errors: Record<string, string>
}>()
</script>

<style lang="scss" scoped>
.images {
  margin-top: 24px;
  .image-field {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 8px;
  }
}
</style>
