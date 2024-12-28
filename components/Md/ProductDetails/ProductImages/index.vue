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
      />
      <div class="small-images">
        <VImg
          v-for="(src, srcIndex) in images.slice(4, 7)"
          :key="`image-small-1-${srcIndex}`"
          :src
        />
      </div>
    </div>
    <div class="image-grid-2">
      <div class="small-images">
        <VImg
          v-for="(src, srcIndex) in images.slice(1, 4)"
          :key="`image-small-2-${srcIndex}`"
          :src
        />
        <div
          v-if="images.length > 7"
          class="more-images"
        >
          + {{ images.length - 7 }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
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
      grid-template-columns: 375px 120px;
    }

    .small-images {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
  }

  .image-grid-2 {
    .small-images {
      display: flex;
      align-items: center;
      gap: 8px;
      justify-content: space-between;

      .more-images {
        cursor: pointer;
        display: flex;
        width: 120px;
        border-radius: 12px;
        height: 80px;
        background-color: #E6E8EF;
        align-items: center;
        justify-content: center;
        font-size: 2rem;
      }
    }
  }

  .v-img {
    cursor: pointer;
  }
}
</style>
