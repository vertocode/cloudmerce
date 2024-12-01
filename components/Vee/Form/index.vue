<template>
  <Form
    v-slot="{ ...attrs }"
    class="vee-form"
    :validation-schema="schema"
    :initial-values="initialValues"
    fast-fail
    as=""
  >
    <VForm
      :id
      :class="formClass"
      @submit.prevent="handleSubmit(attrs)"
    >
      <slot v-bind="attrs" />
    </VForm>
  </Form>
</template>

<script setup lang="ts">
import { Form, type FormSlotProps } from 'vee-validate'
import type { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'

export interface SubmitOptions {
  meta: FormSlotProps['meta']
  resetForm: VoidFunction
}

const props = defineProps<{
  validationSchema?: z.ZodSchema<unknown>
  initialValues?: Record<string, unknown>
  formClass?: string
  id?: string
}>()

const schema = props.validationSchema ? toTypedSchema(props.validationSchema) : {}

const emit = defineEmits()

const handleSubmit = async (attrs: FormSlotProps) => {
  const { values, validate, resetForm, meta } = attrs
  const res = await validate()

  if (!res?.valid) return

  emit('submit', values, { meta, resetForm } as SubmitOptions)
}
</script>
