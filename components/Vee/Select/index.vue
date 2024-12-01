<template>
  <Field
    v-if="name"
    v-slot="{ field, errorMessage }"
    :name
  >
    <VSelect
      v-model="field.value"
      :variant="variant || 'outlined'"
      class="vee-select"
      :error-messages="errorMessage === 'Required' ? 'Campo obrigatório' : errorMessage"
      :items="items"
      v-bind="{ ...$attrs, ...field }"
      autocomplete="off"
      :no-data-text="noDataText || 'Sem opções'"
      :placeholder="placeholder"
    />
  </Field>
</template>

<script setup lang="ts">
import { Field } from 'vee-validate'
import { defineProps } from 'vue'

const props = defineProps<{
  name: string
  items: string[]
  placeholder?: string
  variant?: 'outlined' | 'plain' | 'filled' | 'underlined' | 'solo' | 'solo-inverted' | 'solo-filled'
  noDataText?: string
  required?: boolean
}>()

const { items, placeholder, variant, noDataText } = props
</script>
