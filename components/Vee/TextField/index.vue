<template>
  <Field
    v-if="name"
    v-slot="{ field, errorMessage }"
    :name="name"
  >
    <VTextField
      v-model="field.value"
      :variant="variant || 'outlined'"
      class="vee-text-field"
      autocomplete="off"
      :error-messages="errorMessage === 'Required' ? 'Campo obrigatório' : errorMessage"
      v-bind="{
        ...$attrs,
        ...field,
      }"
      :type="$attrs.type === 'password' ? isPasswordVisible ? 'text' : 'password' : ''"
      :append-inner-icon="$attrs.type === 'password' ? isPasswordVisible ? 'mdi-eye-off' : 'mdi-eye' : ''"
      @click:append-inner="togglePasswordVisibility"
    />
  </Field>
</template>

<script setup lang="ts">
import { Field } from 'vee-validate'
import { ref } from 'vue'

defineProps<{
  name: string
  variant?: 'outlined' | 'plain' | 'filled' | 'underlined' | 'solo' | 'solo-inverted' | 'solo-filled'
}>()

const isPasswordVisible = ref(false)

const togglePasswordVisibility = () => {
  isPasswordVisible.value = !isPasswordVisible.value
}
</script>
