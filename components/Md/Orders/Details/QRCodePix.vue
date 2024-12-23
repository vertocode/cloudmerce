<template>
  <div class="qr-code-pix">
    <h5>QRCode e Pix Copia e Cola</h5>
    <div class="container">
      <div>
        <VImg
          v-if="qrCodeImg"
          :src="qrCodeImg"
          alt="QR Code do Pedido"
          class="qr-code-image"
        />
        <span v-else>QR Code não disponível</span>
      </div>
      <div>
        <VTextField
          v-if="pixCode"
          label="Código Pix"
          outlined
          readonly
          dense
          class="pix-code"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  qrCodeImg: string | null
  pixCode: string | null
}>()
</script>

<style lang="scss" scoped>
.qr-code-pix {

  .container {
    display: grid;
    grid-template-columns: 1.5fr .5fr;
    gap: 24px;

    .qr-code-image {
      margin: auto;
      max-width: 250px;
    }
  }

  @media screen and (max-width: $mobile-breakpoint) {
    .container {
      grid-template-columns: 1fr;
    }
  }
}
</style>
