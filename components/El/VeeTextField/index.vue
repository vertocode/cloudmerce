<template>
  <VTextField
      :variant="variant"
      class="vee-text-field"
      v-model="value.value.value"
      :error-messages="value.errorMessage.value"
      v-bind="$attrs"
      autocomplete="off"
  />
</template>

<script setup lang="ts">
import type { FieldContext } from "vee-validate"

defineProps<{
  value: FieldContext<any>
  variant?: "outlined" | "plain" | "filled" | "underlined" | "solo" | "solo-inverted" | "solo-filled"
}>()
</script>
