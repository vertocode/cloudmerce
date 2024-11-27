<template>
  <div class="dynamic-field">
    <template v-if="field.type === 'text'">
      <v-text-field
          :label="field.label"
          required
          v-model="value"
          outlined
      />
    </template>

    <template v-else-if="field.type === 'number'">
      <v-text-field
          :label="field.label"
          required
          v-model="value"
          type="number"
          outlined
      />
    </template>

    <template v-else-if="field.type === 'options'">
      <v-select
          required
          :label="field.label"
          :items="field.options || []"
          v-model="value"
          outlined
      />
    </template>

    <template v-else>
      <p>Unsupported field type</p>
    </template>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

interface Field {
  label: string
  type: 'text' | 'number' | 'options'
  options?: string[]
}

const props = defineProps<{ field: Field, initialValue?: string }>();

const emit = defineEmits()

const value = ref<string>(props?.initialValue ||'')

watch(value, (newValue) => {
  emit('update', newValue)
})
</script>
