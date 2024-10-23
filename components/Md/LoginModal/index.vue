<template>
  <Modal
      :is-opened="showLoginModal"
      :card-props="{
        prependIcon: 'mdi-account',
        title: 'Login'
      }"
  >
    <template #trigger>
      <div @click="showLoginModal = true">
        <slot />
      </div>
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

      <VSpacer></VSpacer>

      <VRow class="ga-2" justify="end" align-content="end" no-gutters>
        <VCol cols="4">
          <VBtn variant="outlined" @click="onClose">
            Cancelar
          </VBtn>
        </VCol>
        <VCol cols="4">
          <VBtn variant="outlined" color="primary" width="100%" type="submit" :loading="isLoading">
            Login
          </VBtn>
        </VCol>
      </VRow>
    </VForm>
  </Modal>
</template>

<script setup lang="ts">
import Modal from '~/components/El/Modal/index.vue'

const isLoading = ref(false)
const showLoginModal = ref(false)
const email = ref('')
const password = ref('')

const onClose = () => {
  showLoginModal.value = false
}
const handleConfirm = async () => {
  isLoading.value = true
  console.log('Login', email.value, password.value)
  showLoginModal.value = false
  isLoading.value = false
}
</script>
