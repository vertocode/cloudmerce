<template>
  <v-container class="contact-page" fluid>
    <v-row justify="center" align="center" class="mb-5">
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title class="headline">Entre em Contato</v-card-title>
          <v-card-text>
            <p>Estamos aqui para ajudar! Se você tiver alguma dúvida ou precisar de mais informações, não hesite em entrar em contato conosco.</p>
            <v-divider class="my-4" />

            <v-form>
              <v-text-field
                  v-model="name"
                  label="Seu Nome"
                  required
              />
              <v-text-field
                  v-model="email"
                  label="Seu E-mail"
                  required
                  type="email"
              />
              <v-textarea
                  v-model="message"
                  label="Sua Mensagem"
                  required
                  rows="4"
              />
              <v-btn @click="submitContact" color="primary" class="mt-4">Enviar Mensagem</v-btn>
            </v-form>
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

    <v-row justify="center" class="footer-social">
      <v-col class="text-center">
        <v-icon class="social-icon">mdi-whatsapp</v-icon>
        <v-icon class="social-icon">mdi-facebook</v-icon>
        <v-icon class="social-icon">mdi-instagram</v-icon>
        <v-icon class="social-icon">mdi-twitter</v-icon>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useContact } from '~/composables/useContact';
import { useStoreData } from '~/composables/useStoreData';

const { techEmail, formattedWhatsappNumber, whatsappLink } = useContact();
const { storeLogo, storeName } = useStoreData();

const name = ref('');
const email = ref('');
const message = ref('');

const submitContact = () => {
  // Lógica para enviar a mensagem
  alert(`Mensagem enviada por: ${name.value} - ${email.value}`);
};
</script>

<style scoped lang="scss">
.contact-page {
  background-color: #f5f5f5;
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

  .footer-social {
    margin-top: 20px;

    .social-icon {
      font-size: 32px;
      margin: 0 10px;
      cursor: pointer;

      &:hover {
        color: var(--secondary-color-300);
      }
    }
  }
}
</style>
