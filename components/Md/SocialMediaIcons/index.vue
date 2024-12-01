<template>
  <div class="social-media-icons">
    <VIcon
      v-for="socialMedia in storeSocialMedia"
      :key="socialMedia.name"
      class="social-icon"
      :title="`Abrir ${socialMedia.name}`"
      :style="{ color }"
      @click="openSocialMedia(socialMedia.url)"
    >
      {{ socialMedia.icon }}
    </VIcon>
  </div>
</template>

<script setup lang="ts">
const { storeSocialMedia } = useStoreData()

const openSocialMedia = (url: string) => {
  window.open(url)
}

defineProps<{
  color?: string
}>()
</script>

<style scoped lang="scss">
.social-media-icons {
  margin-top: 12px;
  display: flex;
  gap: 16px;
  justify-content: center;

  .social-icon {
    font-size: 32px;
    color: white;
    cursor: pointer;
    background: rgba(255, 255, 255, 0.15);
    border-radius: 50%;
    padding: 8px;

    &:hover {
      color: var(--secondary-color-300);
    }
  }

  @media (max-width: 768px) {
    .social-icon {
      font-size: 24px;
    }
  }
}
</style>
