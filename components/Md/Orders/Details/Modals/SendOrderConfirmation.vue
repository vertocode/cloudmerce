<template>
  <ElModal
    :is-opened="isOpened"
    persistent
    :card-props="{ title: `Enviar Pedido`, prependIcon: 'mdi-truck-alert' }"
    max-width="600"
    @close="$emit('close')"
  >
    <div class="send-order-confirmation">
      <p>Ao clicar em "Confirmar", o status do pedido será alterado para "Pedido Enviado", e o cliente receberá um e-mail informando que o pedido foi despachado para o endereço registrado.</p>
      <div class="buttons">
        <VBtn
          @click="$emit('close')"
        >
          Cancelar
        </VBtn>
        <VBtn
          color="primary"
          @click="onConfirm('product_sent')"
        >
          Confirmar
        </VBtn>
      </div>
    </div>
  </ElModal>
</template>

<script setup lang="ts">
import type { OrderStatus } from '~/types/order'

defineProps<{
  isOpened: boolean
  onConfirm: (newStatus: OrderStatus) => void
}>()
</script>

<style lang="scss" scoped>
.send-order-confirmation {
  p {
    margin-bottom: 16px;
  }

  .buttons {
    display: flex;
    justify-content: flex-end;
    gap: 16px;
  }
}
</style>
