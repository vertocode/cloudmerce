<template>
  <Field
    v-if="name"
    v-slot="{ field, errorMessage }"
    :name
  >
    <div class="radio-group-wrapper">
      <label
        v-if="label"
        class="radio-group-label"
      >
        {{ label }}
      </label>

      <VRadioGroup
        v-model="field.value"
        class="radio-group"
        column
        :error-messages="errorMessage === 'Required' ? 'Campo obrigatório' : errorMessage"
      >
        <VRadio
          v-for="option in options"
          :key="option.value"
          :label="option.label"
          :value="option.value"
        />
      </VRadioGroup>
    </div>
  </Field>
</template>

<script setup lang="ts">
import { Field } from 'vee-validate'

defineProps<{
  name: string
  options: Array<{ label: string, value: string | number }>
  label?: string
}>()
</script>

<style scoped>
.radio-group-wrapper {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.radio-group-label {
  font-size: 1rem;
  font-weight: 500;
  color: #333;
}

.radio-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
