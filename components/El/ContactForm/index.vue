<template>
  <VeeForm :validationSchema="validationSchema" @submit="submitContact" v-slot="{ isSubmitting }">
    <VeeTextField name="name" label="Seu Nome" outlined />
    <VeeTextField name="email" label="Seu E-mail" outlined />
    <VeeTextarea name="message" label="Sua Mensagem" outlined />
    <VeeButton variant="tonal" color="primary" width="100%" type="submit" :loading="isSubmitting">
      Enviar Mensagem
    </VeeButton>
  </VeeForm>
</template>

<script setup lang="ts">
import {z} from "zod"
import emailjs from "emailjs-com"

const config = useRuntimeConfig()

const validationSchema = z.object({
  name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('E-mail inválido'),
  message: z.string().min(1, 'A mensagem é obrigatória')
})

const submitContact = async values => {
  const serviceId = config.public.emailjsServiceId
  const templateId = config.public.emailjstemplateId
  const userId = config.public.emailjsuserId

  if (!serviceId || !templateId || !userId) {
    console.error('Configuração do EmailJS ausente')
    handleError('Erro ao enviar a mensagem, tente novamente mais tarde')
    return
  }

  try {
    await emailjs.send(
        serviceId,
        templateId,
        {
          fromName: values.name,
          userEmail: values.email,
          message: values.message,
          date: new Date().toLocaleString(),
          toName: 'Tech Support (CLOUDMERCE)'
        },
        userId
    )
    handleSuccess('Mensagem enviada com sucesso!')
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error)
    handleError('Erro ao enviar a mensagem, tente novamente mais tarde')
  }
}
</script>
