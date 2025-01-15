<template>
  <Field
    v-if="name"
    v-slot="{ field, errorMessage }"
    :name="name"
  >
    <VFileInput
      v-model="field.value"
      :variant="variant || 'outlined'"
      chips
      class="vee-file-input"
      :error-messages="errorMessage === 'Required' ? 'Campo obrigatório' : errorMessage"
      :accept="accept"
      :show-size="showSize"
      :label="label || 'Selecione um arquivo'"
      :multiple="multiple"
      :name="field.name"
      v-bind="{ ...$attrs }"
      @update:model-value="file => field.onChange(file)"
    >
      <template #append-inner>
        <img
          v-if="field.value"
          :src="getLocalFileUrl(field.value)"
          alt="Pré-visualização do upload"
          class="uploaded-image"
        >
      </template>
    </VFileInput>
  </Field>
</template>

<script setup lang="ts">
import { Field } from 'vee-validate'
import { defineProps } from 'vue'

defineProps<{
  name: string
  variant?: 'outlined' | 'plain' | 'filled' | 'underlined' | 'solo' | 'solo-inverted' | 'solo-filled'
  label?: string
  accept?: string
  showSize?: boolean
  multiple?: boolean
}>()

const getLocalFileUrl = (file: File) => file ? URL.createObjectURL(file) : ''
</script>

<style lang="scss" scoped>
.uploaded-image {
  width: 50px;
  height: 50px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>
