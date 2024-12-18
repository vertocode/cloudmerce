<template>
  <Card class="user-questions">
    <h3>Perguntas para o usuário (Opcional)</h3>
    <h5 class="mt-3">
      Adicione perguntas para o usuário responder, como tamanho de uma roupa, cor ou qualquer outra pergunta necessária para este produto. As perguntas adicionada aqui serão requisitas ao usuário no momento de adicionar este produto ao carrinho.
    </h5>

    <VExpansionPanels
      elevation="0"
      class="example"
    >
      <VExpansionPanel>
        <VExpansionPanelTitle>Exemplo</VExpansionPanelTitle>
        <VExpansionPanelText>
          <p>Nome do campo: Tamanho</p>
          <p>Tipo do campo: Opções</p>
          <p>Opções para o campo:</p>
          <ul>
            <li>Opção 1: P</li>
            <li>Opção 2: M</li>
            <li>Opção 3: G</li>
          </ul>
        </VExpansionPanelText>
      </VExpansionPanel>
    </VExpansionPanels>

    <FieldArray
      v-slot="{ fields, push, remove }"
      name="userFields"
    >
      <div class="user-fields">
        <VRow
          v-for="(userQuestion, userIndex) in fields"
          v-if="fields.length > 0"
          :key="`user-field-${userIndex}`"
          class="user-question-card"
        >
          <VCol cols="12">
            <div class="user-question-title">
              <h4>Campo {{ userIndex + 1 }}:</h4>
              <VBtn
                icon
                class="remove-btn"
                @click="remove(userIndex)"
              >
                <VIcon>mdi-delete</VIcon>
              </VBtn>
            </div>
          </VCol>
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
            cols="12"
            md="6"
            class="user-field"
          >
            <VeeSelect
              :name="`userFields[${userIndex}].type`"
              :label="`Tipo do campo ${userIndex + 1}`"
              :items="['Texto', 'Número', 'Opções']"
              variant="outlined"
            />
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
              cols="12"
              md="6"
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
      </div>
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
  </Card>
</template>

<script setup lang="ts">
import { FieldArray } from 'vee-validate'
import { UserFieldTypeLabel } from '~/types/product'
import Card from '~/components/Md/ProductForm/components/Card.vue'

const initialUserField = {
  label: '',
  type: UserFieldTypeLabel.options,
  options: [''],
}
</script>

<style lang="scss" scoped>
.user-questions {
  margin-top: 24px;
  margin-bottom: 24px;

  .image-field {
    display: flex;
    gap: 12px;
  }

  .example {
    margin-top: 24px;

    .v-expansion-panel-title:hover {
      background-color: #e1e1e1;
    }

    ul {
      margin-left: 24px;
    }
  }

  .user-fields {
    margin-top: 24px;
    margin-bottom: 12px;
    display: flex;
    flex-direction: column;
    gap: 24px;

    .user-question-card {
      padding: 24px;
      background-color: white;
      border: 1px solid var(--secondary-200);
      border-radius: 8px;

      .user-question-title {
        display: flex;
        justify-content: space-between;
        align-items: center;

        h4 {
          margin-bottom: 12px;
        }
      }

      .user-field {
        margin-top: 8px;
      }
    }
  }
}
</style>
