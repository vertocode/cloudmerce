<template>
  <Form class="vee-form" :validation-schema="schema" :initialValues="initialValues" fast-fail as="" v-slot="{ ...attrs }">
    <VForm
        :class="formClass"
        @submit.prevent="handleSubmit(attrs.values, attrs.validate, attrs.resetForm)"
        :id
    >
      <slot v-bind="attrs"></slot>
    </VForm>
  </Form>
</template>

<script setup lang="ts">
import { Form } from 'vee-validate'
import { z } from 'zod';
import { toTypedSchema } from '@vee-validate/zod'

const props = defineProps<{
  validationSchema?: z.ZodSchema<any>
  initialValues?: Record<string, any>
  resetOnSubmit?: boolean
  formClass?: string
  id?: string
}>()

const schema = props.validationSchema ? toTypedSchema(props.validationSchema) : {}

const emit = defineEmits()

const handleSubmit = async (values: Record<string, any>, validate: () => Promise<{ valid: boolean }>, reset: () => void) => {
  const res = await validate()

  if (!res?.valid) return

  emit('submit', values)

  if (props.resetOnSubmit) {
    reset()
  }
}
</script>
