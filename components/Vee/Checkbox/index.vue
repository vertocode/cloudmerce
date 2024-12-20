<template>
  <Field
    v-if="name"
    v-slot="{ field, errorMessage, handleChange }"
    :name
  >
    <div class="checkbox-wrapper">
      <VCheckbox
        :label
        class="checkbox"
        :error-messages="errorMessage === 'Required' ? 'Campo obrigatório' : errorMessage"
        v-bind="{
          ...$attrs,
          ...field,
        }"
        :value="!field.value"
        @click="() => handleChange(field.value = !field.value)"
      >
        <template #label>
          <slot name="label">
            <span class="checkbox-label">{{ label }}</span>
          </slot>
        </template>
      </VCheckbox>
    </div>
  </Field>
</template>

<script setup lang="ts">
import { Field } from 'vee-validate'

defineProps<{
  name: string
  label?: string
}>()
</script>

<style scoped>
.checkbox-wrapper {
  display: flex;
  flex-direction: row;
  gap: 4px;

  .checkbox-label {
    font-size: 1rem;
    font-weight: 500;
    color: #333;
  }
}
</style>
