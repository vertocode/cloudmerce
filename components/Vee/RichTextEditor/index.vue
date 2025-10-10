<template>
  <Field
    v-if="name"
    v-slot="{ field, errorMessage }"
    :name
  >
    <div class="vee-rich-text-editor">
      <label v-if="label" class="field-label">
        {{ label }}
        <span v-if="required" class="required-asterisk">*</span>
      </label>
      <ClientOnly>
        <RichTextEditor
          :model-value="field.value"
          @update:model-value="handleUpdate(field, $event)"
          :placeholder
        />
        <template #fallback>
          <div class="editor-loading">Carregando editor...</div>
        </template>
      </ClientOnly>
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage === 'Required' ? 'Campo obrigatório' : errorMessage }}
      </div>
    </div>
  </Field>
</template>

<script setup lang="ts">
import { Field } from 'vee-validate'

const props = defineProps<{
  name: string
  label?: string
  placeholder?: string
  required?: boolean
}>()

const handleUpdate = (field: any, value: string) => {
  field.value = value
}
</script>

<style scoped lang="scss">
.vee-rich-text-editor {
  margin-bottom: 16px;

  .field-label {
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    margin-bottom: 8px;
    color: rgba(0, 0, 0, 0.87);

    .required-asterisk {
      color: #d32f2f;
      margin-left: 4px;
    }
  }

  .editor-loading {
    padding: 40px;
    text-align: center;
    color: #86868b;
    border: 1px solid rgba(0, 0, 0, 0.12);
    border-radius: 4px;
    background-color: #f5f5f7;
    min-height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .error-message {
    font-size: 0.75rem;
    color: #d32f2f;
    margin-top: 4px;
    padding-left: 14px;
  }
}
</style>
