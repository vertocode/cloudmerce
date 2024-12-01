<template>
  <Field
    v-if="name"
    v-slot="{ field, errorMessage }"
    :name
  >
    <VTextarea
      v-model="field.value"
      :variant="variant || 'outlined'"
      class="vee-text-area"
      :error-messages="errorMessage === 'Required' ? 'Campo obrigatório' : errorMessage"
      v-bind="{ ...$attrs, ...field }"
      rows="4"
      autocomplete="off"
    />
  </Field>
</template>

<script setup lang="ts">
import { Field } from 'vee-validate'
import { defineProps } from 'vue'

const props = defineProps<{
  name: string
  variant?: 'outlined' | 'plain' | 'filled' | 'underlined' | 'solo' | 'solo-inverted' | 'solo-filled'
  required?: boolean
}>()

const { variant } = props
</script>
