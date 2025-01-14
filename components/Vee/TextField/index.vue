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
      :prepend-inner-icon="pInnerIcon"
      :error-messages="errorMessage === 'Required' ? 'Campo obrigatório' : errorMessage"
      v-bind="{
        ...$attrs,
        ...field,
      }"
      :type="$attrs.type === 'password' ? isPasswordVisible ? 'text' : 'password' : $attrs.type as string"
      :append-inner-icon="aInnerIcon"
      @click:append-inner="togglePasswordVisibility"
    />
  </Field>
</template>

<script setup lang="ts">
import { Field } from 'vee-validate'
import { ref } from 'vue'

const props = defineProps<{
  name: string
  type?: string
  variant?: 'outlined' | 'plain' | 'filled' | 'underlined' | 'solo' | 'solo-inverted' | 'solo-filled'
  prependInnerIcon?: string
  appendInnerIcon?: string
}>()

const pInnerIcon = computed(() => {
  if (props.name.includes('email')) {
    return 'mdi-email-outline'
  }

  switch (props.type) {
    case 'password':
      return 'mdi-lock-outline'
    default:
      return props.prependInnerIcon
  }
})

const aInnerIcon = computed(() => {
  switch (props.type) {
    case 'password':
      return isPasswordVisible.value ? 'mdi-eye-off' : 'mdi-eye'
    default:
      return props.appendInnerIcon
  }
})

const isPasswordVisible = ref(false)

const togglePasswordVisibility = () => {
  isPasswordVisible.value = !isPasswordVisible.value
}
</script>
