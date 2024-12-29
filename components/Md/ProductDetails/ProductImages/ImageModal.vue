<template>
  <div
    v-if="isOpened"
    class="overlay"
    @click.self="$emit('close')"
  >
    <div class="image-modal">
      <div
        ref="panzoomContainer"
        class="panzoom-container"
      >
        <MdProductImage
          :image="images"
          :hide-delimiter-background="false"
          :model-value="String(currentImageIndex)"
          show-arrows
        />
      </div>
      <div class="controls">
        <VBtn
          :disabled="isZoomInDisabled"
          variant="elevated"
          icon
          @click="zoomIn"
        >
          <VIcon>mdi-plus</VIcon>
        </VBtn>
        <VBtn
          :disabled="isZoomOutDisabled"
          variant="elevated"
          icon
          @click="zoomOut"
        >
          <VIcon>mdi-minus</VIcon>
        </VBtn>
        <VBtn
          :disabled="isResetDisabled"
          variant="elevated"
          icon
          @click="resetZoom"
        >
          <VIcon>mdi-refresh</VIcon>
        </VBtn>
      </div>
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
import { ref, watch, nextTick, onUnmounted } from 'vue'
import Panzoom from '@panzoom/panzoom'

const props = defineProps<{
  isOpened: boolean
  currentImageIndex: number
  images: string[]
}>()

const panzoomInstance = ref<ReturnType<typeof Panzoom> | null>(null)
const panzoomContainer = ref<HTMLDivElement | null>(null)

const currentScale = ref(1)
const minScale = 1
const maxScale = 5

const isZoomInDisabled = computed(() => currentScale.value >= maxScale)
const isZoomOutDisabled = computed(() => currentScale.value <= minScale)
const isResetDisabled = computed(() => currentScale.value === minScale)

const updateScale = () => {
  if (panzoomInstance.value) {
    currentScale.value = panzoomInstance.value.getScale()
  }
}

const zoomIn = () => {
  panzoomInstance.value?.zoomIn()
  updateScale()
}

const zoomOut = () => {
  panzoomInstance.value?.zoomOut()
  updateScale()
}

const resetZoom = () => {
  panzoomInstance.value?.reset()
  updateScale()
}

const initializePanzoom = async () => {
  await nextTick()
  if (panzoomContainer.value && !panzoomInstance.value) {
    panzoomInstance.value = Panzoom(panzoomContainer.value, {
      maxScale: 5,
      minScale: 1,
      contain: 'outside',
    })

    panzoomContainer.value.addEventListener('wheel', panzoomInstance.value.zoomWithWheel)
    updateScale()
  }
  else {
    console.error('Panzoom not available', panzoomInstance.value, panzoomContainer.value)
  }
}

const destroyPanzoom = () => {
  if (panzoomInstance.value) {
    panzoomInstance.value.destroy()
    panzoomInstance.value = null
  }
}

watch(
  () => props.isOpened,
  async (newValue) => {
    if (newValue) {
      await initializePanzoom()
    }
    else {
      destroyPanzoom()
    }
  },
)

onUnmounted(() => {
  destroyPanzoom()
})
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
  display: flex;
  align-items: center;
  justify-content: center;

  .image-modal {
    background-color: white;
    height: max-content;
    width: 90vw;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;

    .panzoom-container {
      width: 100%;
      overflow: hidden;
    }

    :deep(.v-img) {
      max-height: 90vh;
      cursor: grab;
    }

    .close-btn {
      position: absolute;
      top: 16px;
      right: 16px;
    }

    .controls {
      position: absolute;
      top: 16px;
      left: 16px;
      display: flex;
      gap: 12px;

      .v-btn--disabled {
        cursor: not-allowed;
        color: rgba(0, 0, 0, 0.26);
        .v-icon {
          color: rgba(0, 0, 0, 0.26);
        }
      }
    }
  }
}

.panzoom-container {
  cursor: grab;

  &.panzoom-moving {
    cursor: grabbing;
  }
}
</style>
