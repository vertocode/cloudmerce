<template>
  <div class="color-field">
    <Field
      v-if="name"
      v-slot="{ field, errorMessage, value }"
      :name
    >
      <VTextField
        v-model="field.value"
        v-mask="'XXXXXXXX'"
        :variant="variant || 'outlined'"
        prefix="#"
        class="vee-color-field"
        autocomplete="off"
        :error-messages="errorMessage === 'Required' ? 'Campo obrigatório' : errorMessage"
        v-bind="{
          ...$attrs,
          ...field,
        }"
      />
      {{ value }}
      <span
        :key="value"
        class="color-example"
        :style="`background-color: ${value}`"
      />
    </Field>
  </div>
</template>

<script setup lang="ts">
import { Field } from 'vee-validate'

defineProps<{
  name: string
  variant?: 'outlined' | 'plain' | 'filled' | 'underlined' | 'solo' | 'solo-inverted' | 'solo-filled'
}>()
</script>

<style lang="scss" scoped>
.color-field {
  position: relative;

  .color-example {
    width: 24px;
    height: 24px;
    border-radius: 16px;
    position: absolute;
    top: 16px;
    right: 16px;
    background-color: #000;
  }
}
</style>
