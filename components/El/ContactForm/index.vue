<template>
  <VeeForm
    v-slot="{ isSubmitting }"
    :validation-schema="validationSchema"
    @submit="submitContact"
  >
    <VRow>
      <VCol
        cols="12"
        md="6"
        class="pl-0 pb-0"
      >
        <VeeTextField
          name="name"
          label="Seu Nome"
          outlined
        />
      </VCol>
      <VCol
        cols="12"
        md="6"
        class="pl-0 pb-0"
      >
        <VeeTextField
          name="email"
          label="Seu E-mail"
          outlined
        />
      </VCol>
      <VCol cols="12">
        <VeeTextarea
          name="message"
          label="Sua Mensagem"
          outlined
        />
      </VCol>
    </VRow>
    <VeeButton
      variant="elevated"
      color="primary"
      class="float-end mb-5"
      :loading="isSubmitting"
    >
      Enviar Mensagem
    </VeeButton>
  </VeeForm>
</template>

<script setup lang="ts">
import { z } from 'zod'
import emailjs from 'emailjs-com'
import type { SubmitOptions } from '~/components/Vee/Form/index.vue'

interface Props {
  additionalInfo?: string
}

const props = defineProps<Props>()

const config = useRuntimeConfig()

const validationSchema = z.object({
  name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('E-mail inválido'),
  message: z.string().min(1, 'A mensagem é obrigatória'),
})

const submitContact = async (values: Record<string, any>, { resetForm }: SubmitOptions) => {
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
        message: `${values.message} ${props.additionalInfo ? `\n \n \n ${props.additionalInfo}` : ''}`,
        date: new Date().toLocaleString(),
        toName: 'Tech Support (CLOUDMERCE)',
      },
      userId,
    )
    handleSuccess('Mensagem enviada com sucesso!')
    resetForm()
  }
  catch (error) {
    console.error('Erro ao enviar e-mail:', error)
    handleError('Erro ao enviar a mensagem, tente novamente mais tarde')
  }
}
</script>
