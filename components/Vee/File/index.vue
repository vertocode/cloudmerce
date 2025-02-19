<template>
  <Field
    v-if="name"
    v-slot="{ field, errorMessage }"
    :name="name"
  >
    <VFileInput
      :key="`file-input-${isMountedV}`"
      v-model="field.value"
      :variant="variant || 'outlined'"
      chips
      class="vee-file-input"
      :error-messages="errorMessage === 'Required' ? 'Campo obrigatório' : errorMessage"
      :accept="accept || 'image/*'"
      show-size
      :label="label"
      placeholder="Selecione um arquivo"
      :multiple="multiple"
      :name="field.name"
      v-bind="{ ...$attrs }"
      @update:model-value="file => field.onChange(file)"
    >
      <template #append-inner>
        <img
          v-if="field.value"
          :src="getImageSource(field.value)"
          alt="Pré-visualização do upload"
          class="uploaded-image"
        >
      </template>
    </VFileInput>
  </Field>
</template>

<script setup lang="ts">
import { Field } from 'vee-validate'

const isMountedV = ref(0)

onMounted(() => {
  isMountedV.value = 1
})

defineProps<{
  name: string
  variant?: 'outlined' | 'plain' | 'filled' | 'underlined' | 'solo' | 'solo-inverted' | 'solo-filled'
  label?: string
  accept?: string
  multiple?: boolean
}>()

const getImageSource = (file: File | string) => {
  if (!file) return ''

  if (typeof file === 'string') {
    return file
  }

  return URL.createObjectURL(file)
}

const convertUrlToFile = async (url: string, fileName = 'file'): Promise<File> => {
  const response = await fetch(url)
  const blob = await response.blob()
  return new File([blob], fileName, { type: blob.type })
}
</script>

<style lang="scss" scoped>
.uploaded-image {
  width: 50px;
  height: 50px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>
