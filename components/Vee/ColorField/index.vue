<template>
  <div class="color-field">
    <Field
      v-if="name"
      v-slot="{ field, errorMessage, value, setValue }"
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
      <VMenu
        :close-on-content-click="false"
      >
        <template #activator="{ props }">
          <span
            class="color-example"
            :style="`background-color: ${color}`"
            v-bind="props"
          />
        </template>
        <VColorPicker
          v-model="color"
          show-swatches
          hide-inputs
          @update:model-value="(v) => setValue(v.replace('#', ''))"
        />
      </VMenu>
    </Field>
  </div>
</template>

<script setup lang="ts">
import { Field } from 'vee-validate'

const color = ref('#000')

defineProps<{
  name: string
  variant?: 'outlined' | 'plain' | 'filled' | 'underlined' | 'solo' | 'solo-inverted' | 'solo-filled'
}>()
</script>

<style lang="scss" scoped>
.color-field {
  position: relative;

  .color-example {
    border: 1px solid gray;
    cursor: pointer;
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
