<template>
  <Field
    v-if="name"
    v-slot="{ field, errorMessage }"
    :name
  >
    <VTextField
      v-model="field.value"
      v-mask="mask"
      :variant="variant || 'outlined'"
      class="vee-text-field"
      autocomplete="off"
      :error-messages="errorMessage === 'Required' ? 'Campo obrigatório' : errorMessage"
      v-bind="{
        ...$attrs,
        ...field,
      }"
    />
  </Field>
</template>

<script setup lang="ts">
import { Field } from 'vee-validate'

defineProps<{
  name: string
  mask: string
  variant?: 'outlined' | 'plain' | 'filled' | 'underlined' | 'solo' | 'solo-inverted' | 'solo-filled'
}>()
</script>
