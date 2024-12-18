<template>
  <div class="w-100">
    <h5>Adicione perguntas para o usuário responder, como tamanho de uma roupa, cor ou qualquer outra pergunta necessária para este produto.</h5>
    <FieldArray
      v-slot="{ fields, push, remove }"
      name="userFields"
    >
      <VRow
        v-for="(userQuestion, userIndex) in fields"
        v-if="fields.length > 0"
        :key="`user-field-${userIndex}`"
      >
        <VCol
          cols="10"
          md="6"
          class="user-field mt-0"
        >
          <VeeTextField
            :name="`userFields[${userIndex}].label`"
            :label="`Nome do campo ${userIndex + 1}`"
            variant="outlined"
          />
        </VCol>

        <VCol
          cols="10"
          md="4"
          class="user-field"
        >
          <VeeSelect
            :name="`userFields[${userIndex}].type`"
            :label="`Tipo do campo ${userIndex + 1}`"
            :items="['Texto', 'Número', 'Opções']"
            variant="outlined"
          />
        </VCol>
        <VCol cols="2">
          <VBtn
            icon
            class="remove-btn mt-4"
            @click="remove(userIndex)"
          >
            <VIcon>mdi-delete</VIcon>
          </VBtn>
        </VCol>
        <h5
          v-if="userQuestion.type === UserFieldTypeLabel.options"
          class="w-100 mb-3"
        >
          Opções para o campo {{ userIndex + 1 }}:
        </h5>
        <FieldArray
          v-slot="{ fields: userOptions, push: addUserOption, remove: removeUserOption }"
          :name="`userFields[${userIndex}].options`"
        >
          <VCol
            v-for="(_, optionIndex) in userOptions"
            :key="optionIndex"
            cols="6"
            class="image-field mt-0"
          >
            <VeeTextField
              :name="`userFields[${userIndex}].options[${optionIndex}]`"
              :label="`Opção ${optionIndex + 1}`"
              variant="outlined"
            />
            <VBtn
              v-if="userOptions.length > 1"
              icon
              class="remove-btn mb-6"
              :class="optionIndex % 2 === 0 ? 'mr-4' : ''"
              @click="removeUserOption(optionIndex)"
            >
              <VIcon>mdi-delete</VIcon>
            </VBtn>
          </VCol>
          <VCol cols="12">
            <VBtn
              variant="outlined"
              class="mb-8 float-end"
              @click="addUserOption('')"
            >
              Adicionar opção para o campo {{ userIndex + 1 }}
            </VBtn>
          </VCol>
        </FieldArray>
      </VRow>
      <VRow>
        <VCol cols="12">
          <VBtn
            color="primary"
            class="mb-8 float-end mt-3"
            @click="push(initialUserField)"
          >
            <VIcon color="white">
              mdi-plus
            </VIcon> Adicionar pergunta de usuário
          </VBtn>
        </VCol>
      </VRow>
    </FieldArray>
  </div>
</template>

<script setup lang="ts">
import { FieldArray } from 'vee-validate'
import { UserFieldTypeLabel } from '~/types/product'

const initialUserField = {
  label: '',
  type: UserFieldTypeLabel.options,
  options: [''],
}
</script>
