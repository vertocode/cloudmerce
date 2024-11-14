<template>
  <Modal
      :is-opened="showLoginModal"
      persistent
      @close="onClose"
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

    <VeeForm :validation-schema="validationSchema" @submit="submit" v-slot="{ errors, isSubmitting }">
      <VeeTextField
          name="email"
          label="E-mail"
          outlined
          :error-messages="errors.email"
      />

      <VeeTextField
          name="password"
          label="Senha"
          outlined
          type="password"
          :error-messages="errors.password"
      />

      <VSpacer></VSpacer>

      <VRow class="ga-2" justify="end" align-content="end" no-gutters>
        <VCol cols="4">
          <VBtn variant="text" @click="onClose">
            Cancelar
          </VBtn>
        </VCol>
        <VCol cols="4">
          <VeeButton color="primary" width="100%" type="submit" :loading="isSubmitting">
            Login
          </VeeButton>
        </VCol>
      </VRow>
    </VeeForm>
  </Modal>
</template>

<script setup lang="ts">
import Modal from '~/components/El/Modal/index.vue'
import { z } from 'zod'
import { ref } from 'vue'
import { useUser } from '~/composables/useUser'

const validationSchema = z.object({
  email: z
      .string()
      .min(1, { message: 'E-mail é obrigatório' })
      .email({ message: 'E-mail inválido' }),
  password: z
      .string()
      .min(1, { message: 'Senha é obrigatória' })
      .min(6, { message: 'Senha deve ter pelo menos 6 caracteres' }),
})

const isLoading = ref(false)
const showLoginModal = ref(false)
const { login } = useUser()

const onClose = () => {
  showLoginModal.value = false
}

const submit = async (values: { email: string, password: string }) => {
  isLoading.value = true

  const { code } = await login({
    email: values.email,
    password: values.password,
  })

  isLoading.value = false

  if (code === 'success') {
    showLoginModal.value = false
  }
}
</script>
