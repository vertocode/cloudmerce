<template>
  <div class="rich-text-preview">
    <div class="preview-label">
      <VIcon size="small">
        mdi-text-box
      </VIcon>
      <span>Texto Rico</span>
    </div>
    <div class="preview-content">
      <p v-if="section.content">
        {{ truncatedContent }}
      </p>
      <p
        v-else
        class="empty-text"
      >
        Nenhum conteúdo adicionado
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IRichTextSection } from '~/types/page'

const props = defineProps<{
  section: IRichTextSection
}>()

const truncatedContent = computed(() => {
  const maxLength = 150
  if (props.section.content.length > maxLength) {
    return props.section.content.substring(0, maxLength) + '...'
  }
  return props.section.content
})
</script>

<style scoped lang="scss">
.rich-text-preview {
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
    p {
      font-size: 0.75rem;
      color: #86868b;
      margin: 0;
      line-height: 1.4;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
    }

    .empty-text {
      font-style: italic;
    }
  }
}
</style>
