<template>
  <Field v-if="name" :name v-slot="{ field, errorMessage }">
    <VSelect
        :variant="variant"
        class="vee-select"
        v-model="field.value"
        :error-messages="errorMessage"
        :items="items"
        v-bind="{ ...$attrs, ...field }"
        autocomplete="off"
        :no-data-text="noDataText || 'Sem opções'"
        :placeholder="placeholder"
        label="Selecionar Opção"
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
