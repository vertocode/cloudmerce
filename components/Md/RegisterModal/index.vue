<template>
  <Modal
      :is-opened="showRegisterModal"
      :card-props="{
        prependIcon: 'mdi-account-plus',
        title: 'Register'
      }"
  >
    <template #trigger>
      <div @click="showRegisterModal = true">
        <slot />
      </div>
    </template>

    <VForm fast-fail @submit.prevent="submit" aria-autocomplete="off">
      <VeeTextField
          :value="name"
          label="Name"
          outlined
          required
      />

      <VeeTextField
          :value="email"
          label="Email"
          outlined
          required
      />

      <VeeTextField
          :value="password"
          label="Password"
          outlined
          required
          type="password"
      />

      <VeeTextField
          :value="repeatPassword"
          label="Repeat Password"
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
          <VBtn
              variant="tonal"
              color="primary"
              width="100%"
              type="submit"
              :loading="isLoading"
          >
            Register
          </VBtn>
        </VCol>
      </VRow>
    </VForm>
  </Modal>
</template>

<script setup lang="ts">
import Modal from '~/components/El/Modal/index.vue'
import VeeTextField from '~/components/El/VeeTextField/index.vue'
import { useField, useForm } from 'vee-validate'
import {validateEmail, validateName, validatePassword, validatePasswordConfirmation} from "~/utils/Validators";

const { handleSubmit } = useForm({
  validationSchema: {
    name(value: string) {
      return validateName(value)
    },
    email (value: string) {
      return validateEmail(value)
    },
    password: (value: string) => {
      return validatePassword(value)
    },
    repeatPassword: (value: string) => {
      return validatePasswordConfirmation(value, password?.value?.value as string)
    }
  }
})

const isLoading = ref(false)
const showRegisterModal = ref(false)

const name = useField('name')
const email = useField('email')
const password = useField('password')
const repeatPassword = useField('repeatPassword')

const onClose = () => {
  showRegisterModal.value = false
}
const submit = handleSubmit(async values => {
  isLoading.value = true
  alert(JSON.stringify(values, null, 2))
  showRegisterModal.value = false
  isLoading.value = false
})
</script>
