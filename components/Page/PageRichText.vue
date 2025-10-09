<template>
  <div class="page-rich-text">
    <div
      class="rich-text-content"
      v-html="formattedContent"
    />
  </div>
</template>

<script setup lang="ts">
import type { IRichTextSection } from '~/types/page'

const props = defineProps<{
  section: IRichTextSection
}>()

const formattedContent = computed(() => {
  // Basic formatting - you can enhance this with a rich text editor
  return props.section.content.replace(/\n/g, '<br>')
})
</script>

<style scoped lang="scss">
.page-rich-text {
  max-width: 800px;
  margin: 0 auto;
  padding: 32px 24px;

  .rich-text-content {
    font-size: 1.125rem;
    line-height: 1.8;
    color: #1d1d1f;

    :deep(h1), :deep(h2), :deep(h3) {
      margin-top: 32px;
      margin-bottom: 16px;
      font-weight: 600;
    }

    :deep(p) {
      margin-bottom: 16px;
    }
  }
}
</style>
