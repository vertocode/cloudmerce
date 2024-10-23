<template>
  <VDialog
      :model-value="isOpened"
      max-width="400"
      persistent
  >
    <template v-slot:activator="{ props: activatorProps }">
      <div @click="isOpened = true">
        <slot name="trigger" v-bind="activatorProps" />
      </div>
    </template>

    <v-card v-bind="cardProps">
      <v-container>
        <slot></slot>
      </v-container>

      <template v-slot:actions>
        <VSpacer></VSpacer>

        <slot name="actions" :onClose="onClose" :isLoading="isLoading" :onConfirm="onConfirm">
          <VBtn @click="onClose">
            Cancelar
          </VBtn>

          <VBtn variant="tonal" :loading="isLoading" @click="onConfirm">
            Confirmar
          </VBtn>
        </slot>
      </template>
    </v-card>
  </VDialog>
</template>

<script setup lang="ts">
const isLoading = ref(false)
const isOpened = ref(false)

const props = defineProps({
  cardProps: Object,
  handleConfirm: Function
})

const onClose = () => {
  isOpened.value = false
}

const onConfirm = async () => {
  const { handleConfirm } = props
  isLoading.value = true
  if (handleConfirm) {
    await handleConfirm()
  }
  isOpened.value = false
  isLoading.value = false
}
</script>
