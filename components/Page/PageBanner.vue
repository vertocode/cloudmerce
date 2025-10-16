<template>
  <div
    class="page-banner"
    :class="{ 'is-clickable': section.pathname }"
    :style="{
      backgroundImage: `url(${section.backgroundImage})`,
      marginTop: `${section.marginTop || 0}px`,
      marginBottom: `${section.marginBottom || 0}px`
    }"
    @click="handleBannerClick"
  >
    <div class="banner-overlay">
      <div class="banner-content">
        <h2
          v-if="section.title"
          class="banner-title"
        >
          {{ section.title }}
        </h2>
        <p
          v-if="section.description"
          class="banner-description"
        >
          {{ section.description }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IBannerSection } from '~/types/page'

const props = defineProps<{
  section: IBannerSection
}>()

const router = useRouter()

const handleBannerClick = () => {
  if (props.section.pathname) {
    router.push(props.section.pathname)
  }
}
</script>

<style scoped lang="scss">
.page-banner {
  position: relative;
  width: 100%;
  min-height: 400px;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;

  &.is-clickable {
    cursor: pointer;

    &:hover {
      transform: scale(1.01);
    }

    &:active {
      transform: scale(0.99);
    }
  }

  @media (max-width: 768px) {
    min-height: 300px;
  }

  .banner-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.5));
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .banner-content {
    position: relative;
    z-index: 1;
    text-align: center;
    color: white;
    padding: 32px;
    max-width: 800px;

    .banner-title {
      font-size: 3rem;
      font-weight: 700;
      margin-bottom: 16px;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);

      @media (max-width: 768px) {
        font-size: 2rem;
      }
    }

    .banner-description {
      font-size: 1.25rem;
      line-height: 1.6;
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);

      @media (max-width: 768px) {
        font-size: 1rem;
      }
    }
  }
}
</style>
