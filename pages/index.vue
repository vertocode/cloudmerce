<template>
  <!-- Default Homepage Layout -->
  <template v-if="!useCustomHomepage">
    <MdBanner />
    <MdSearchBar style="margin-top: -24px" />
    <MdContainer class="main_container">
      <MdProductList
        :products
        :loading
        :current-page="currentPage"
        :total-pages="totalPages"
        :total-items="totalItems"
        :update-product-list="updateProductList"
        @page-change="onChangePage"
      />
    </MdContainer>
  </template>

  <!-- Custom Homepage Layout -->
  <template v-else>
    <div
      v-if="loadingHomepage"
      class="loading-container"
    >
      <VProgressCircular
        indeterminate
        color="primary"
        size="64"
      />
    </div>

    <div
      v-else
      class="custom-homepage"
    >
      <div
        v-for="(section, index) in homepageSections"
        :key="index"
        class="homepage-section"
      >
        <component
          :is="getSectionComponent(section.type)"
          :section="section"
        />
      </div>
    </div>
  </template>
</template>

<script setup lang="ts">
import PageBanner from '~/components/Page/PageBanner.vue'
import PageProductCarousel from '~/components/Page/PageProductCarousel.vue'
import PageRichText from '~/components/Page/PageRichText.vue'

definePageMeta({
  layout: 'no-container',
})

const { products, loading, update: updateProductList, totalPages, totalItems, onChangePage, currentPage } = useProductList()
const { whitelabel } = useWhitelabel()

const useCustomHomepage = computed(() => whitelabel.value?.homepage?.useCustomLayout || false)
const homepageSections = computed(() => whitelabel.value?.homepage?.sections || [])
const loadingHomepage = ref(false)

const getSectionComponent = (type: string) => {
  const components = {
    'banner': PageBanner,
    'product-carousel': PageProductCarousel,
    'rich-text': PageRichText,
  }
  return components[type as keyof typeof components] || null
}
</script>

<style scoped lang="scss">
.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: 64px 24px;
}

.custom-homepage {
  .homepage-section {
    margin-bottom: 48px;
  }
}
</style>
