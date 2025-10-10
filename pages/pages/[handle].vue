<template>
  <div class="custom-page">
    <div
      v-if="loading"
      class="loading-container"
    >
      <VProgressCircular
        indeterminate
        color="primary"
        size="64"
      />
    </div>

    <div
      v-else-if="!page"
      class="error-container"
    >
      <VIcon
        size="64"
        color="error"
      >
        mdi-file-document-remove-outline
      </VIcon>
      <h2>Página não encontrada</h2>
      <VBtn
        color="primary"
        @click="$router.push('/')"
      >
        Voltar para Home
      </VBtn>
    </div>

    <div
      v-else
      class="page-content"
    >
      <h1 class="page-title">
        {{ page.title }}
      </h1>

      <div
        v-for="(section, index) in page.sections"
        :key="index"
        class="page-section"
      >
        <component
          :is="getSectionComponent(section.type)"
          :section="section"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IPage } from '~/types/page'
import PageBanner from '~/components/Page/PageBanner.vue'
import PageProductCarousel from '~/components/Page/PageProductCarousel.vue'
import PageRichText from '~/components/Page/PageRichText.vue'
import PageProductListing from '~/components/Page/PageProductListing.vue'

const route = useRoute()
const handle = route.params.handle as string

const { getPageByHandle } = usePages()
const page = ref<IPage | null>(null)
const loading = ref(true)

const getSectionComponent = (type: string) => {
  const components = {
    'banner': PageBanner,
    'product-carousel': PageProductCarousel,
    'rich-text': PageRichText,
    'product-listing': PageProductListing,
  }
  return components[type as keyof typeof components] || null
}

onMounted(async () => {
  try {
    page.value = await getPageByHandle(handle)
  } catch (error) {
    console.error('Error loading page:', error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped lang="scss">
.custom-page {
  min-height: 60vh;

  .loading-container,
  .error-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 64px 24px;
    gap: 24px;

    h2 {
      font-size: 1.5rem;
      color: #1d1d1f;
    }
  }

  .page-content {
    .page-title {
      font-size: 2.5rem;
      font-weight: 700;
      text-align: center;
      margin: 48px 0;
      color: #1d1d1f;

      @media (max-width: 768px) {
        font-size: 2rem;
        margin: 32px 0;
      }
    }

    .page-section {
      margin-bottom: 48px;
    }
  }
}
</style>
