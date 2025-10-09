<template>
  <Card class="user-questions">
    <h3>Variantes do Produto (Opcional)</h3>
    <h5 class="mt-3">
      Adicione variantes como tamanho, cor ou qualquer outra opção necessária para este produto. Exemplo: Tamanho (P, M, G), Cor (Azul, Vermelho, Preto). Você pode adicionar imagens específicas para cada variante.
    </h5>

    <VExpansionPanels
      elevation="0"
      class="example"
    >
      <VExpansionPanel>
        <VExpansionPanelTitle>Exemplo</VExpansionPanelTitle>
        <VExpansionPanelText>
          <p>Nome da variante: Tamanho</p>
          <p>Tipo da variante: Opções</p>
          <p>Opções da variante:</p>
          <ul>
            <li>Opção 1: P (com imagem opcional)</li>
            <li>Opção 2: M (com imagem opcional)</li>
            <li>Opção 3: G (com imagem opcional)</li>
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
          :key="`user-field-${userIndex}`"
          class="user-question-card"
        >
          <VCol cols="12">
            <div class="user-question-title">
              <h4>Variante {{ userIndex + 1 }}:</h4>
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
              :label="`Nome da variante ${userIndex + 1}`"
              placeholder="Ex: Tamanho, Cor, Material"
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
              :label="`Tipo da variante ${userIndex + 1}`"
              :items="['Texto', 'Número', 'Opções']"
              variant="outlined"
            />
          </VCol>
          <h5
            v-if="userQuestion.type === UserFieldTypeLabel.options"
            class="w-100 mb-3"
          >
            Opções para a variante {{ userIndex + 1 }}:
          </h5>
          <FieldArray
            v-slot="{ fields: userOptions, push: addUserOption, remove: removeUserOption }"
            :name="`userFields[${userIndex}].options`"
          >
            <VCol
              v-for="(_, optionIndex) in userOptions"
              :key="optionIndex"
              cols="12"
              class="option-container"
            >
              <div class="option-header">
                <h5>Opção {{ optionIndex + 1 }}</h5>
                <VBtn
                  v-if="userOptions.length > 1"
                  icon
                  size="small"
                  class="remove-btn"
                  @click="removeUserOption(optionIndex)"
                >
                  <VIcon>mdi-delete</VIcon>
                </VBtn>
              </div>

              <VRow>
                <!-- Name field (always required) -->
                <VCol cols="12" md="6">
                  <VeeTextField
                    :name="`userFields[${userIndex}].options[${optionIndex}].name`"
                    :label="isColorVariant(userQuestion.value?.label) ? `Nome da Cor ${optionIndex + 1}` : `Nome da Opção ${optionIndex + 1}`"
                    placeholder="Ex: Azul, Vermelho, Preto"
                    variant="outlined"
                    required
                  />
                </VCol>

                <!-- Hex field (required if color variant) -->
                <VCol
                  v-if="isColorVariant(userQuestion.value?.label)"
                  cols="12"
                  md="6"
                >
                  <VeeColorField
                    :name="`userFields[${userIndex}].options[${optionIndex}].hex`"
                    :label="`Código Hex ${optionIndex + 1}`"
                    variant="outlined"
                  />
                </VCol>

                <!-- Image field (optional) -->
                <VCol cols="12" :md="isColorVariant(userQuestion.value?.label) ? 12 : 6">
                  <VeeFile
                    :name="`userFields[${userIndex}].options[${optionIndex}].image`"
                    :label="`Imagem ${optionIndex + 1} (Opcional)`"
                    variant="outlined"
                    accept="image/*"
                  />
                </VCol>
              </VRow>
            </VCol>
            <VCol cols="12">
              <VBtn
                variant="outlined"
                class="mb-8 float-end"
                @click="addUserOption({ name: '', hex: '', image: null })"
              >
                Adicionar opção para a variante {{ userIndex + 1 }}
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
            </VIcon> Adicionar variante
          </VBtn>
        </VCol>
      </VRow>
    </FieldArray>
  </Card>
</template>

<script setup lang="ts">
import { FieldArray, useFieldValue } from 'vee-validate'
import { UserFieldTypeLabel } from '~/types/product'
import Card from '~/components/Md/ProductForm/components/Card.vue'

const initialUserField = {
  label: '',
  type: UserFieldTypeLabel.options,
  options: [{ name: '', hex: '', image: null }],
}

// Check if variant is a color variant
const isColorVariant = (label: string | undefined) => {
  if (!label) return false
  const lowerLabel = label.toLowerCase()
  return lowerLabel === 'cor' || lowerLabel === 'color' || lowerLabel === 'cores' || lowerLabel === 'colors'
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

      .option-container {
        padding: 16px;
        margin-bottom: 16px;
        background-color: #f9f9f9;
        border: 1px solid #e0e0e0;
        border-radius: 8px;

        .option-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;

          h5 {
            margin: 0;
            font-weight: 600;
            color: #424242;
          }
        }
      }
    }
  }
}
</style>
