<template>
  <Modal
    max-width="max-content"
    :is-opened="showPaletteModal"
    persistent
    :card-props="{ class: 'palette-modal' }"
    @close="onClose"
  >
    <template #default>
      <v-card-title class="headline">
        Escolha sua Paleta de Cores
      </v-card-title>
      <v-card-text>
        <v-container fluid>
          <div class="list">
            <v-row
              justify="center"
              align="center"
            >
              <v-col
                v-for="(palette, index) in palettes"
                :key="index"
                cols="12"
                md="4"
                class="palette-col"
              >
                <v-card
                  :style="{ backgroundColor: palette.primaryColor, color: palette.secondaryColor }"
                  class="palette-card"
                  :class="{ selected: selectedPalette?.primaryColor === palette.primaryColor }"
                  @click="selectPalette(palette, index)"
                >
                  <v-card-title>{{ palette.name }}</v-card-title>
                  <v-card-subtitle>Cor Primária: {{ palette.primaryColor }}</v-card-subtitle>
                  <v-card-subtitle>Cor Secundária: {{ palette.secondaryColor }}</v-card-subtitle>
                  <v-card-actions>
                    <v-btn
                      variant="tonal"
                      class="select-btn"
                      color="white"
                    >
                      Selecionar
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </div>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="grey darken-1"
          @click="onClose"
        >
          Fechar
        </v-btn>
        <v-btn
          variant="flat"
          :disabled="!selectedPalette"
          :color="selectedPalette ? selectedPalette.primaryColor : ''"
          @click="applyPalette"
        >
          Aplicar Paleta {{ selectedPalette ? selectedPalette.index + 1 : null }}
        </v-btn>
      </v-card-actions>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { palettes } from './data/palettes'
import type { IPalette } from './type/palette'
import Modal from '~/components/El/Modal/index.vue'

const props = defineProps<{
  showPaletteModal: boolean
  onClose: () => void
}>()

const selectedPalette = ref<IPalette & { index: number } | null>(null)

const selectPalette = (palette: IPalette, index: number) => {
  selectedPalette.value = { ...palette, index }
}

const applyPalette = () => {
  if (selectedPalette.value) {
    const { primaryColor: primary, secondaryColor: secondary } = selectedPalette.value
    handleChangePallete({ primary, secondary })
    if (props.onClose) props.onClose()
    selectedPalette.value = null
  }
}
</script>

<style scoped lang="scss">
.palette-modal {
  .v-card {
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  .list {
    max-height: 70vh;
    overflow-y: auto;
  }

  .palette-col {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .palette-card {
    border-radius: 12px;
    padding: 20px;
    transition: transform 0.2s;
    cursor: pointer;

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
    }

    &.selected {
      border: 2px solid rgba(255, 255, 255, 0.8);
      box-shadow: 0 4px 20px rgba(255, 255, 255, 0.7);
      transform: scale(1.05);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .v-card-title {
      font-weight: 600;
      font-size: 1.2rem;
      color: white;
    }

    .v-card-subtitle {
      color: white;
      font-size: 1rem;
    }
  }

  .select-btn {
    margin-top: 10px;
    border-radius: 8px;
  }

  .v-card-actions {
    justify-content: flex-end;
  }
}
</style>
