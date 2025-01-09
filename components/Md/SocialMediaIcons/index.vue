<template>
  <div
    v-if="storeSocialMedia.length"
    class="social-media-icons"
  >
    <VIcon
      v-for="socialMedia in storeSocialMedia.values()"
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
const { whitelabel } = useWhitelabel()

const storeSocialMedia = computed(() => {
  const { wpp, instagram, facebook, twitter } = whitelabel.value.socialMedia || {}
  const config = []

  if (wpp) {
    config.push({
      name: 'WhatsApp',
      url: `https://wa.me/55${wpp}`,
      icon: 'mdi-whatsapp',
    })
  }

  if (instagram) {
    config.push({
      name: 'Instagram',
      url: `https://www.instagram.com/${instagram}`,
      icon: 'mdi-instagram',
    })
  }

  if (facebook) {
    config.push({
      name: 'Facebook',
      url: `https://www.facebook.com/${facebook}`,
      icon: 'mdi-facebook',
    })
  }

  if (twitter) {
    config.push({
      name: 'Twitter',
      url: `https://x.com/${twitter}`,
      icon: 'mdi-twitter',
    })
  }

  return config
})

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
