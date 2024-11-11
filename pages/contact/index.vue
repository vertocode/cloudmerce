<template>
  <v-container class="contact-page" fluid>
    <v-row justify="center" align="center" class="mb-5">
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title class="headline">Entre em Contato</v-card-title>
          <v-card-text>
            <p>Estamos aqui para ajudar! Se você tiver alguma dúvida ou precisar de mais informações, não hesite em entrar em contato conosco.</p>
            <v-divider class="my-4" />

            <VForm fast-fail @submit.prevent="submitContact">
              <VeeTextField
                  :value="name"
                  label="Seu Nome"
                  outlined
                  required
              />
              <VeeTextField
                  :value="email"
                  label="Seu E-mail"
                  outlined
                  required
              />
              <VeeTextarea
                  :value="message"
                  label="Sua Mensagem"
                  required
              />
              <VBtn
                  variant="tonal"
                  color="primary"
                  width="100%"
                  type="submit"
                  :loading="isLoading"
              >
                Enviar Mensagem
              </VBtn>
            </VForm>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row justify="center" class="footer-contact">
      <v-col class="text-center">
        <p>E-mail: {{ techEmail }}</p>
        <p>Telefone: {{ formattedWhatsappNumber }}</p>
      </v-col>
    </v-row>

    <MdSocialMediaIcons color="black" />
  </v-container>
</template>

<script setup lang="ts">
import emailjs from 'emailjs-com'
import {useField, useForm} from "vee-validate";
import {validateEmail, validateName} from "~/utils/Validators";

const { techEmail, formattedWhatsappNumber } = useContact()
const config = useRuntimeConfig()

const isLoading = ref(false)

const { handleSubmit } = useForm({
  validationSchema: {
    name(value: string) {
      return validateName(value)
    },
    email (value: string) {
      return validateEmail(value)
    },
    message: (value: string) => {
      return !!value || 'Mensagem é obrigatória'
    }
  }
})

const name = useField('name')
const email = useField('email')
const message = useField('message')

const submitContact = handleSubmit(async values => {
  const serviceId = config.public.emailjsServiceId
  const templateId = config.public.emailjstemplateId
  const userId = config.public.emailjsuserId
  if (!serviceId || !templateId || !userId) {
    console.error('EmailJS config not found')
    handleError('Erro ao enviar a mensagem, tente novamente mais tarde.')
    return
  }
  isLoading.value = true

  try {
    await emailjs.send(serviceId, templateId, {
      fromName: values.name,
      userEmail: values.email,
      message: values.message,
      date: new Date().toLocaleString(),
      toName: 'Tech Support (CLOUDMERCE)',
    }, userId);

    handleSuccess('Mensagem enviada com sucesso!')
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error)
    handleError('Erro ao enviar a mensagem, tente novamente mais tarde.')
  } finally {
    isLoading.value = false;
  }
})
</script>

<style scoped lang="scss">
.contact-page {
  padding: 20px;

  .v-card {
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  .footer-links {
    margin-top: 40px;
  }

  .footer-contact {
    margin-top: 20px;

    p {
      margin: 0;
    }
  }
}
</style>
