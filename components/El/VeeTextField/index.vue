<template>
  <VTextField
      v-model="value.value.value"
      :error-messages="value.errorMessage.value"
      v-bind="$attrs"
  />
</template>

<script setup lang="ts">
import type { FieldContext } from "vee-validate"

defineProps<{
  value: FieldContext<any>
}>()
</script>
