<template>
  <div class="pagination">
    <VPagination
      v-model="internalPage"
      :length="totalPages"
      color="primary"
      circle
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { VPagination } from 'vuetify/components'

const props = defineProps<{
  currentPage: number
  totalPages: number
}>()

const emit = defineEmits<{
  (event: 'pageChange', page: number): void
}>()

const internalPage = ref(props.currentPage)

watch(
  () => props.currentPage,
  (newPage) => {
    if (newPage !== internalPage.value) {
      internalPage.value = newPage
    }
  },
)

watch(
  () => internalPage.value,
  () => {
    emit('pageChange', internalPage.value)
  },
)
</script>

<style lang="scss" scoped>
.pagination {
  display: flex;
  justify-content: center;
  margin-top: 16px;
}
</style>
