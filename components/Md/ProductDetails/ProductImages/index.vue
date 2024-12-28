<template>
  <div
    v-if="images.length"
    class="product-images"
  >
    <div
      class="image-grid-1"
      :class="{ ['two-rows']: images.length > 4 }"
    >
      <VImg
        :src="images[0]"
        alt="first-image"
        @click="currentIndexModal = 0"
      />
      <div class="small-images">
        <VImg
          v-for="(src, srcIndex) in images.slice(4, 7)"
          :key="`image-small-1-${srcIndex}`"
          :src
          @click="currentIndexModal = srcIndex + 4"
        />
      </div>
    </div>
    <div class="image-grid-2">
      <div class="small-images">
        <VImg
          v-for="(src, srcIndex) in images.slice(1, 4)"
          :key="`image-small-2-${srcIndex}`"
          :src
          @click="currentIndexModal = srcIndex + 1"
        />
        <div
          v-if="images.length > 7"
          class="more-images"
          @click="currentIndexModal = 6"
        >
          + {{ images.length - 7 }}
        </div>
      </div>
    </div>

    <div class="image-flex-mobile">
      <VImg
        :src="images[0]"
        alt="first-image"
        class="first-image"
      />
      <div class="small-images">
        <VImg
          v-for="(src, srcIndex) in images.slice(1, 4)"
          :key="`image-small-mobile-${srcIndex}`"
          :src
          @click="currentIndexModal = srcIndex + 1"
        />
        <div
          v-if="images.length > 7"
          class="more-images"
          @click="currentIndexModal = 6"
        >
          + {{ images.length - 4 }}
        </div>
      </div>
    </div>
  </div>
  <ImageModal
    :images
    :current-image-index="currentIndexModal || 0"
    :is-opened="currentIndexModal !== null"
    @close="currentIndexModal = null"
  />
</template>

<script setup lang="ts">
import ImageModal from '~/components/Md/ProductDetails/ProductImages/ImageModal.vue'

const currentIndexModal = ref<number | null>(null)

defineProps<{
  images: string[]
}>()
</script>

<style lang="scss">
.product-images {
  display: grid;

  .image-grid-1 {
    display: grid;
    justify-content: space-between;
    grid-template-columns: 1fr;
    gap: 8px;

    &.two-rows {
      grid-template-columns: 1fr 120px;
    }

    .small-images {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
  }

  .image-grid-2 {
    margin-top: 8px;

    .small-images {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      align-items: center;
      gap: 8px;
      justify-content: space-between;
    }
  }

  .more-images {
    cursor: pointer;
    display: flex;
    border-radius: 12px;
    height: 80px;
    background-color: #E6E8EF;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
  }

  .v-img {
    cursor: pointer;
  }

  .image-flex-mobile {
    display: none;
  }

  @media screen and (max-width: $mobile-breakpoint) {
    .image-grid-1, .image-grid-2 {
      display: none;
    }

    .image-flex-mobile {
      display: flex;
      flex-direction: column;
      gap: 8px;

      .first-image {
        width: 100%;
      }

      .small-images {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 8px;

        .v-img {
          width: 100%;
          height: auto;
          object-fit: cover;
        }
      }
    }
  }

  @media screen and (max-width: 580px) {
    .more-images {
      font-size: 1.5rem;
    }
  }
}
</style>
