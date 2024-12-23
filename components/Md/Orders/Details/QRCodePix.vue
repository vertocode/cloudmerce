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
      <div class="pix-code-container">
        <VTextarea
          v-if="pixCode"
          :model-value="pixCode"
          label="Código Pix"
          outlined
          readonly
          dense
          class="pix-code"
        />
        <VBtn
          v-if="pixCode"
          icon
          variant="outlined"
          class="copy-btn"
          :aria-label="'Copiar Código Pix'"
          @click="handleCopyPixCode(pixCode)"
        >
          <VIcon>mdi-content-copy</VIcon>
        </VBtn>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  qrCodeImg: string | null
  pixCode: string | null
}>()

const handleCopyPixCode = (code: string) => {
  try {
    copyToClipboard(code)
    handleSuccess('Código Pix copiado com sucesso')
  }
  catch (e) {
    handleError('Falha ao copiar o código Pix')
  }
}
</script>

<style lang="scss" scoped>
.qr-code-pix {

  .container {
    display: grid;
    grid-template-columns: 250px 1fr;
    align-items: center;
    gap: 24px;

    .qr-code-image {
      margin: auto;
      max-width: 250px;
    }

    .pix-code-container {
      display: flex;
      align-items: center;
      gap: 8px;

      .pix-code {
        flex: 1;
      }

      .copy-btn {
        height: 56px;
      }
    }
  }

  @media screen and (max-width: $mobile-breakpoint) {
    .container {
      grid-template-columns: 1fr;
    }
  }
}
</style>
