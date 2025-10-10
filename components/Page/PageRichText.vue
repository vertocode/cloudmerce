<template>
  <div class="page-rich-text">
    <RichTextDisplay
      :content="section.content"
      class="rich-text-content"
    />
  </div>
</template>

<script setup lang="ts">
import type { IRichTextSection } from '~/types/page'

const props = defineProps<{
  section: IRichTextSection
}>()
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
