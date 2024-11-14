<template>
  <Field v-if="name" :name v-slot="{ field, errorMessage }">
    <VTextField
        :variant="variant || 'outlined'"
        class="vee-text-field"
        autocomplete="off"
        :error-messages="errorMessage"
        v-bind="{ ...$attrs, ...field }"
    />
  </Field>
</template>

<script setup lang="ts">
import { Field } from "vee-validate"

defineProps<{
  name: string
  variant?: "outlined" | "plain" | "filled" | "underlined" | "solo" | "solo-inverted" | "solo-filled"
  required?: boolean
}>()
</script>
