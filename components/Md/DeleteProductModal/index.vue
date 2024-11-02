<template>
  <Modal
      :is-opened="showDeleteModal"
      :card-props="{ title: `Deletar Produto ${productName}` }"
  >
    <template #trigger>
      <div class="w-100" @click="showDeleteModal = true">
        <slot />
      </div>
    </template>

    <div class="modal-content">
      <p>
        Esta ação irá excluir o produto <strong>{{ productName }}</strong> de forma permanente e é irreversível. Deseja continuar?
      </p>

      <VSpacer></VSpacer>

      <VRow class="ga-2" justify="end" align-content="end" no-gutters>
        <VCol cols="4">
          <VBtn variant="text" @click="onClose">
            Cancelar
          </VBtn>
        </VCol>
        <VCol cols="4">
          <VBtn variant="tonal" color="error" width="100%" @click="confirmDelete" :loading="isLoading">
            Deletar
          </VBtn>
        </VCol>
      </VRow>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Modal from '~/components/El/Modal/index.vue';

const props = defineProps<{
  loading?: boolean
  onConfirm: () => Promise<void>;
  productName: string;
}>()

const showDeleteModal = ref(false)
const isLoading = ref(false);

const onClose = () => {
  showDeleteModal.value = false;
}

const confirmDelete = async () => {
  isLoading.value = true;
  try {
    await props.onConfirm();
    onClose();
  } catch (error) {
    console.error("Erro ao deletar produto:", error);
  } finally {
    isLoading.value = false;
  }
};
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
