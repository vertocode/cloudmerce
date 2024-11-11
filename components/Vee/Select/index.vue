<template>
  <VSelect
      :variant="variant"
      class="vee-select"
      v-model="value.value.value"
      :error-messages="value.errorMessage.value"
      :items="items"
      v-bind="$attrs"
      autocomplete="off"
      :no-data-text="noDataText || 'Sem opções'"
      :placeholder="placeholder"
      label="Selecionar Opção"
  />
</template>

<script setup lang="ts">
import type { FieldContext } from 'vee-validate'
import { defineProps } from 'vue'

const props = defineProps<{
  value: FieldContext<any>
  items: string[]
  placeholder?: string
  variant?: 'outlined' | 'plain' | 'filled' | 'underlined' | 'solo' | 'solo-inverted' | 'solo-filled',
  noDataText?: string
}>()

const { value, items } = props
</script>
