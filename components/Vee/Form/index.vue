<template>
  <Form :validation-schema="schema" fast-fail as="" v-slot="{ values, errors, ...attrs }">
    <VForm
        @submit.prevent="getHasErrors(errors) ? null : $emit('submit', values)"
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
}>()

const schema = props.validationSchema ? toTypedSchema(props.validationSchema) : {}
const getHasErrors = (errors: Record<string, (string | undefined)>) => Object.keys(errors).length > 0
</script>
