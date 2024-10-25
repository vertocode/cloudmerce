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

    <VForm fast-fail @submit.prevent="submit">
      <VeeTextField
          :value="email"
          label="E-mail"
          outlined
          required
      />

      <VeeTextField
          :value="password"
          label="Senha"
          outlined
          required
          type="password"
      />

      <VSpacer></VSpacer>

      <VRow class="ga-2" justify="end" align-content="end" no-gutters>
        <VCol cols="4">
          <VBtn variant="text" @click="onClose">
            Cancelar
          </VBtn>
        </VCol>
        <VCol cols="4">
          <VBtn variant="tonal" color="primary" width="100%" type="submit" :loading="isLoading">
            Login
          </VBtn>
        </VCol>
      </VRow>
    </VForm>
  </Modal>
</template>

<script setup lang="ts">
import Modal from '~/components/El/Modal/index.vue'
import VeeTextField from "~/components/El/VeeTextField/index.vue";
import {useField, useForm} from "vee-validate";
import {validateEmail, validatePassword} from "~/utils/Validators";

const { handleSubmit } = useForm({
  validationSchema: {
    email (value: string) {
      return validateEmail(value)
    },
    password: (value: string) => {
      return validatePassword(value)
    }
  }
})

const isLoading = ref(false)
const showLoginModal = ref(false)
const email = useField('email')
const password = useField('password')

const onClose = () => {
  showLoginModal.value = false
}

const submit = handleSubmit(async values => {
  isLoading.value = true
  console.log('Login', values)
  showLoginModal.value = false
  isLoading.value = false
})
</script>
