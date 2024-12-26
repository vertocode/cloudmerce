<template>
  <VExpansionPanels
    v-model="expandedPanels"
    elevation="0"
  >
    <VExpansionPanel>
      <VExpansionPanelTitle>
        <slot name="title">
          <h4 class="title">
            {{ title }}
          </h4>
        </slot>
      </VExpansionPanelTitle>
      <VExpansionPanelText>
        <slot />
      </VExpansionPanelText>
    </VExpansionPanel>
  </VExpansionPanels>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string
  defaultExpanded?: boolean
}>()

const expandedPanels = ref<number[]>(props.defaultExpanded ? [0] : [])
</script>

<style lang="scss" scoped>
.title {
  font-weight: 500;
  font-size: 1rem !important;
}
</style>
