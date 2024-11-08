<template>
  <Modal
      :is-opened="showDeleteModal"
      :card-props="{ title: `Deletar Tipo de produto ${productType}` }"
  >
    <template #trigger>
      <div @click="showDeleteModal = true">
        <slot />
      </div>
    </template>

    <div class="modal-content">
      <p>
        Esta ação irá excluir o <strong>tipo de produto</strong>, de forma permanente e é <strong>irreversível</strong>. Todos os produtos associados a este tipo ficarão sem categoria.
      </p>

      <p>
        A ação será realizada ao clicar no botão ‘Salvar’.
      </p>

      <VSpacer></VSpacer>

      <VRow class="ga-2" justify="end" align-content="end" no-gutters>
        <VCol cols="4">
          <VBtn variant="text" @click="onClose">
            Cancelar
          </VBtn>
        </VCol>
        <VCol cols="4">
          <VBtn variant="tonal" color="error" width="100%" @click="onConfirm" :loading="isLoading">
            Confirmar
          </VBtn>
        </VCol>
      </VRow>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Modal from '~/components/El/Modal/index.vue';

defineProps<{
  loading?: boolean
  onConfirm: () => Promise<void>;
  productType: string;
}>()

const showDeleteModal = ref(false)
const isLoading = ref(false);

const onClose = () => {
  showDeleteModal.value = false;
}
</script>

<style scoped lang="scss">
.modal-content {
  p {
    font-size: 1rem;
    color: #333;
    text-align: center;
    margin-bottom: 24px;
  }
}
</style>
