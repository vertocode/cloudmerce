<template>
  <VeeForm
    v-slot="{ errors, isSubmitting }"
    :validation-schema
    @submit="handleSubmit"
  >
    {{ errors }}
    <VeeTextField
      name="name"
      label="Nome"
    />
    <VeeTextField
      name="email"
      label="E-mail"
      type="email"
    />
    <VeeTextField
      name="password"
      label="Senha"
      type="password"
    />
    <VeeColorField
      name="color"
      label="Cor"
    />
    <VeeButton :loading="isSubmitting">
      Enviar
    </VeeButton>
  </VeeForm>
</template>

<script setup lang="ts">
import { z } from 'zod'

const handleSubmit = (values: Record<string, any>) => {
  window.alert(JSON.stringify(values))
}

const validationSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Nome deve ter pelo menos 3 caracteres' }),
  email: z
    .string()
    .email({ message: 'E-mail inválido' }),
  password: z
    .string()
    .min(6, { message: 'Senha deve ter pelo menos 6 caracteres' }),
})
</script>
