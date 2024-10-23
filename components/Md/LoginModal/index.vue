<template>
  <Modal
      :card-props="{
        prependIcon: 'mdi-account',
        title: 'Login'
      }"
  >
    <template #trigger>
      <slot />
    </template>

    <VForm @submit.prevent="handleConfirm">
      <VTextField
          v-model="email"
          label="Email"
          outlined
          required
      />

      <VTextField
          v-model="password"
          label="Password"
          outlined
          required
          type="password"
      />

      <template #actions="{ onClose, isLoading }">
        <VBtn @click="onClose">
          Cancelar
        </VBtn>

        <VBtn type="submit" variant="tonal" :loading="isLoading">
          Login
        </VBtn>
      </template>
    </VForm>
  </Modal>
</template>

<script setup lang="ts">
import Modal from '~/components/El/Modal/index.vue'

const email = ref('')
const password = ref('')

const handleConfirm = async () => {
  console.log('Login', email.value, password.value)
}
</script>
