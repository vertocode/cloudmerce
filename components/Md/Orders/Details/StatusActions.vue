<template>
  <div
    v-if="isAdmin && ['paid', 'product_sent'].includes(status)"
    class="status-actions"
  >
    <h3>Mude o status do pedido (Admin):</h3>
    <div class="container">
      <VBtn
        v-if="status === 'paid'"
        @click="showSendOrderConfirmationModal = true"
      >
        Enviar Pedido
        <VIcon class="ml-1">
          mdi-truck-alert
        </VIcon>
      </VBtn>
      <VBtn
        v-if="status === 'product_sent'"
        @click="showFinishedOrderConfirmationModal = true"
      >
        Pedido Entregue
        <VIcon class="ml-1">
          mdi-check
        </VIcon>
      </VBtn>
    </div>
  </div>
  <SendOrderConfirmation
    :is-opened="showSendOrderConfirmationModal"
    :on-confirm="handleStatusChange"
    @close="showSendOrderConfirmationModal = false"
  />
  <FinishedOrderConfirmation
    :is-opened="showFinishedOrderConfirmationModal"
    :on-confirm="handleStatusChange"
    @close="showFinishedOrderConfirmationModal = false"
  />
</template>

<script setup lang="ts">
import type { OrderStatus } from '~/types/order'
import SendOrderConfirmation from '~/components/Md/Orders/Details/Modals/SendOrderConfirmation.vue'
import FinishedOrderConfirmation from '~/components/Md/Orders/Details/Modals/FinishedOrderConfirmation.vue'

defineProps<{
  status: OrderStatus
}>()

const emits = defineEmits()

const showSendOrderConfirmationModal = ref<boolean>(false)
const showFinishedOrderConfirmationModal = ref<boolean>(false)

const { isAdmin } = useUser()

const handleStatusChange = (newStatus: OrderStatus) => {
  emits('onChangeStatus', newStatus)

  if (newStatus === 'product_sent') {
    showSendOrderConfirmationModal.value = false
  }

  if (newStatus === 'finished') {
    showFinishedOrderConfirmationModal.value = false
  }
}
</script>

<style lang="scss" scoped>
.status-actions {
  margin-bottom: 16px;
  margin-top: 16px;

  .container {
    margin-top: 12px;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 16px;
  }
}
</style>
