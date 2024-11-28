<template>
  <Form class="vee-form" :validation-schema="schema" :initialValues="initialValues" fast-fail as="" v-slot="{ ...attrs }">
    <VForm
        :class="formClass"
        @submit.prevent="handleSubmit(attrs)"
        :id
    >
      <slot v-bind="attrs"></slot>
    </VForm>
  </Form>
</template>

<script setup lang="ts">
import {Form, type FormSlotProps} from 'vee-validate'
import { z } from 'zod';
import { toTypedSchema } from '@vee-validate/zod'

export interface SubmitOptions {
  meta: FormSlotProps['meta']
  resetForm: VoidFunction
}

const props = defineProps<{
  validationSchema?: z.ZodSchema<any>
  initialValues?: Record<string, any>
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
