<template>
  <ElModal
    :is-opened="isOpened"
    persistent
    :card-props="{ title: `Pedido Entregue`, prependIcon: 'mdi-check' }"
    max-width="600"
    @close="$emit('close')"
  >
    <div class="finished-order-confirmation">
      <p>Ao clicar em "Confirmar", o status do pedido será alterado para "Pedido Entregue", e o cliente receberá um e-mail informando que o pedido foi entregue para o endereço registrado.</p>
      <div class="buttons">
        <VBtn
          @click="$emit('close')"
        >
          Cancelar
        </VBtn>
        <VBtn
          color="primary"
          @click="onConfirm"
        >
          Confirmar
        </VBtn>
      </div>
    </div>
  </ElModal>
</template>

<script setup lang="ts">
defineProps<{
  isOpened: boolean
  onConfirm?: (fields: Record<string, string>) => void
}>()
</script>

<style lang="scss" scoped>
.finished-order-confirmation {
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
