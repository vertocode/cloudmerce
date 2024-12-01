<template>
  <VChip :color="getColor(status)">
    {{ getOrderLabelStatus(status) }}
  </VChip>
</template>

<script setup lang="ts">
import type { OrderStatus } from '~/types/order'

defineProps<{
  status: OrderStatus
}>()

const getColor = (status: OrderStatus) => {
  switch (status) {
    case 'pending_payment':
      return 'warning'
    case 'paid':
      return 'success'
    case 'product_sent':
      return 'info'
    case 'finished':
      return 'primary'
    default:
      return 'error'
  }
}
</script>
