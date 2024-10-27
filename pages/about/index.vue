<template>
  <div class="about-us">
    <VContainer class="content-container">
      <VRow class="platform-section">
        <VCol cols="12" md="6">
          <h1 class="title">Sobre Nossa Plataforma</h1>
          <p class="description">
            Bem-vindo(a) ao nosso sistema de e-commerce! Somos uma plataforma dedicada a oferecer uma experiência de compra segura, moderna e de alta performance.
            Nossas soluções são desenvolvidas com tecnologia de ponta, garantindo uma navegação fluida e prática. Além disso, prezamos pela segurança e privacidade dos dados,
            oferecendo suporte constante para que sua jornada de compra seja a melhor possível.
          </p>
        </VCol>
        <VCol cols="12" md="6" class="video-container">
          <iframe width="100%" height="315" src="https://www.youtube.com/embed/xNJql5M38N8?si=OrZyVCXIYmvveypT" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
        </VCol>
      </VRow>

      <VRow class="store-section">
        <VCol cols="12" md="6">
          <VIcon large class="store-icon" color="var(--primary-color-500)">mdi-store</VIcon>
          <h2 class="store-title">Sobre a {{ storeName }}</h2>
          <p class="store-description">
            {{ storeDescription }}
          </p>
        </VCol>
        <VCol cols="12" md="6">
          <VImg :src="storeLogo" alt="Logo da Loja" class="store-image" />
        </VCol>
      </VRow>
    </VContainer>
  </div>
</template>

<script setup lang="ts">
import { useStoreData } from "~/composables/useStoreData"

const youtubeVideo = 'https://www.youtube.com/watch?v=xNJql5M38N8&t=18s'
const { storeDescription, storeName, storeLogo } = useStoreData()
</script>

<style scoped lang="scss">
.about-us {
  padding: 60px 0;
  color: #333;

  .title, .store-title {
    font-size: 32px;
    font-weight: bold;
    margin-bottom: 20px;
    color: var(--primary-color-700);
  }

  .description, .store-description {
    font-size: 18px;
    line-height: 1.6;
    color: #555;
    margin-bottom: 16px;
  }

  .platform-section, .store-section {
    padding: 20px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .youtube-video {
    width: 100%;
    max-width: 100%;
    max-height: 300px;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  }

  .store-icon {
    font-size: 48px;
    margin-bottom: 12px;
    color: var(--primary-color-600);
  }

  .store-image {
    max-width: 100%;
    max-height: 200px;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    object-fit: contain;
    margin-top: 20px;
  }
}
</style>
