<template>
  <div class="dynamic-field">
    <template v-if="field.type === 'text'">
      <v-text-field
          :label="field.label"
          v-model="value"
          outlined
      />
    </template>

    <template v-else-if="field.type === 'number'">
      <v-text-field
          :label="field.label"
          v-model="value"
          type="number"
          outlined
      />
    </template>

    <template v-else-if="field.type === 'options'">
      <v-select
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
  label: string;
  type: 'text' | 'number' | 'options';
  options?: string[];
}

const props = defineProps<{ field: Field }>();

const value = ref<string>('')
</script>

<style scoped>
.dynamic-field {
  margin-bottom: 16px;
}
</style>
