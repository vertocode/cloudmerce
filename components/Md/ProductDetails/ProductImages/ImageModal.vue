<template>
  <div
    v-if="isOpened"
    class="overlay"
    @click.stop="$emit('close')"
  >
    <div
      class="image-modal"
    >
      <MdProductImage
        :image="images"
        :model-value="String(currentImageIndex)"
        show-arrows
      />
      <VBtn
        variant="elevated"
        icon
        class="close-btn"
        @click="$emit('close')"
      >
        <VIcon>mdi-close</VIcon>
      </VBtn>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  isOpened: boolean
  currentImageIndex: number
  images: string[]
}>()
</script>

<style lang="scss" scoped>
.overlay {
  cursor: pointer;
  background-color: rgba(220, 220, 220, 0.73);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;

  .image-modal {
    background-color: white;
    position: fixed;
    top: 0;
    left: 5%;
    right: 5%;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;

    .close-btn {
      position: absolute;
      top: 16px;
      right: 16px;
    }
  }
}
</style>
