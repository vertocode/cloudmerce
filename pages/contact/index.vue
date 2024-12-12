<template>
  <v-container
    class="contact-page"
    fluid
  >
    <v-row
      justify="center"
      align="center"
      class="mb-5"
    >
      <v-col
        cols="12"
        md="6"
      >
        <v-card>
          <v-card-title class="headline">
            Entre em Contato
          </v-card-title>
          <v-card-text>
            <p>Estamos aqui para ajudar! Se você tiver alguma dúvida ou precisar de mais informações, não hesite em entrar em contato conosco.</p>
            <v-divider class="my-4" />

            <ElContactForm />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row
      v-if="storeEmail || formattedWhatsappNumber"
      justify="center"
      class="footerContact"
    >
      <v-col class="text-center">
        <p v-if="storeEmail">
          E-mail: {{ storeEmail }}
        </p>
        <p v-if="formattedWhatsappNumber">
          Telefone: {{ formattedWhatsappNumber }}
        </p>
      </v-col>
    </v-row>

    <md-social-media-icons color="black" />
  </v-container>
</template>

<script setup lang="ts">
const { storeEmail, formattedWhatsappNumber } = useContact()
</script>

<style scoped lang="scss">
.contact-page {
  padding: 20px;

  .v-card {
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  .footerContact {
    margin-top: 20px;

    p {
      margin: 0;
    }
  }
}
</style>
