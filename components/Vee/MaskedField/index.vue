<template>
  <Field v-if="name" :name v-slot="{ field, errorMessage }">
    <VTextField
        :variant="variant || 'outlined'"
        class="vee-text-field"
        v-model="field.value"
        autocomplete="off"
        :error-messages="errorMessage === 'Required' ? 'Campo obrigatório' : errorMessage"
        v-mask="mask"
        v-bind="{
          ...$attrs,
           ...field
        }"
    />
  </Field>
</template>

<script setup lang="ts">
import { Field } from "vee-validate"

defineProps<{
  name: string
  mask: string
  variant?: "outlined" | "plain" | "filled" | "underlined" | "solo" | "solo-inverted" | "solo-filled"
}>()
</script>
