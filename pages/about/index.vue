<template>
  <div class="about-us">
    <VContainer v-if="whitelabel">
      <header>
        <VIcon
          large
          class="store-icon"
          color="var(--primary-color-500)"
        >
          mdi-store
        </VIcon>
        <VImg
          :src="whitelabel.logoUrl"
          alt="Logo da Loja"
          class="store-logo"
        />
      </header>

      <h2 class="store-title">
        Sobre a {{ whitelabel.name }}
      </h2>
      <p class="store-description">
        {{ whitelabel.description }}
      </p>
    </VContainer>
    <VProgressCircular
      v-else
      indeterminate
      size="100"
      color="primary"
    />
  </div>
</template>

<script setup lang="ts">
const { whitelabel } = useWhitelabel()
</script>

<style scoped lang="scss">
.about-us {
  padding: 60px 0;
  color: #333;

  header {
    display: flex;
    align-items: center;
    gap: 48px;

    .store-icon {
      font-size: 48px;
      margin-bottom: 12px;
      color: var(--primary-color-600);
    }

    .store-logo {
      height: 48px;

      :deep(img) {
        width: max-content;
      }
    }
  }

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

  .store-section {
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
}
</style>
