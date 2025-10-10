<template>
  <div class="banner-preview">
    <div class="preview-label">
      <VIcon size="small">
        mdi-image
      </VIcon>
      <span>Banner</span>
    </div>
    <div class="preview-content">
      <div
        v-if="section.backgroundImage"
        class="preview-image"
      >
        <img
          :src="section.backgroundImage"
          alt="Banner background"
        >
      </div>
      <div class="preview-text">
        <strong v-if="section.title">{{ section.title }}</strong>
        <p v-if="section.description">
          {{ section.description }}
        </p>
        <p
          v-if="section.pathname"
          class="pathname-text"
        >
          <VIcon size="x-small">mdi-link</VIcon>
          Link: {{ section.pathname }}
        </p>
        <p
          v-if="!section.title && !section.description"
          class="empty-text"
        >
          Sem título ou descrição
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IBannerSection } from '~/types/page'

defineProps<{
  section: IBannerSection
}>()
</script>

<style scoped lang="scss">
.banner-preview {
  .preview-label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.875rem;
    font-weight: 600;
    color: #1d1d1f;
    margin-bottom: 12px;
  }

  .preview-content {
    display: flex;
    gap: 16px;
    align-items: center;

    .preview-image {
      width: 80px;
      height: 80px;
      border-radius: 8px;
      overflow: hidden;
      background-color: #e0e0e0;
      flex-shrink: 0;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .preview-text {
      flex: 1;

      strong {
        display: block;
        font-size: 0.875rem;
        margin-bottom: 4px;
      }

      p {
        font-size: 0.75rem;
        color: #86868b;
        margin: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }

      .empty-text {
        font-style: italic;
      }

      .pathname-text {
        display: flex;
        align-items: center;
        gap: 4px;
        color: #667eea;
        font-weight: 500;
        margin-top: 4px;
      }
    }
  }
}
</style>
