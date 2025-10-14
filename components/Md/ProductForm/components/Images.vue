<template>
  <Card class="images">
    <h3>Adicionar imagens para o produto</h3>
    <VRow>
      <FieldArray
        v-slot="{ fields, push, remove }"
        name="imageFiles"
      >
        <VCol
          v-for="(_, index) in fields"
          :key="`image-field-${index}`"
          cols="12"
          :md="fields.length === 1 ? 12 : 6"
          class="image-field mt-0"
        >
          <div class="image-input-wrapper">
            <!-- Show existing image preview if available -->
            <div v-if="oldImageUrls && oldImageUrls[index]" class="existing-image-preview">
              <img :src="oldImageUrls[index]" :alt="`Imagem ${index + 1}`" class="preview-img" />
              <VChip size="small" color="success" class="mt-2">Imagem atual</VChip>
            </div>

            <VeeFile
              :name="`imageFiles[${index}]`"
              :label="oldImageUrls && oldImageUrls[index] ? `Substituir Imagem ${index + 1}` : `Imagem ${index + 1}`"
            />
          </div>
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
      v-if="errors?.imageFiles"
      class="mb-5"
      color="warning"
    >
      <p v-if="errors?.imageFiles">
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
  oldImageUrls?: string[]
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

  .image-input-wrapper {
    flex: 1;
  }

  .existing-image-preview {
    margin-bottom: 12px;
    padding: 12px;
    background-color: #f5f5f5;
    border-radius: 8px;
    text-align: center;

    .preview-img {
      max-width: 100%;
      max-height: 200px;
      object-fit: contain;
      border-radius: 4px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
  }
}
</style>
