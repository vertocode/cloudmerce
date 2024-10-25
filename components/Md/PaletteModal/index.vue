<template>
  <Modal max-width="max-content" :isOpened="showPaletteModal" :cardProps="{ class: 'palette-modal' }">
    <template #default>
      <v-card-title class="headline">Escolha sua Paleta de Cores</v-card-title>
      <v-card-text>
        <v-container fluid>
          <div class="list">
            <v-row justify="center" align="center">
              <v-col v-for="(palette, index) in palettes" :key="index" cols="12" md="4" class="palette-col">
                <v-card
                    :style="{ backgroundColor: palette.primaryColor, color: palette.secondaryColor }"
                    class="palette-card"
                    @click="selectPalette(palette)"
                >
                  <v-card-title>{{ palette.name }}</v-card-title>
                  <v-card-subtitle>Cor Primária: {{ palette.primaryColor }}</v-card-subtitle>
                  <v-card-subtitle>Cor Secundária: {{ palette.secondaryColor }}</v-card-subtitle>
                  <v-card-actions>
                    <v-btn variant="tonal" class="select-btn" color="white">Selecionar</v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </div>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="onClose" color="grey darken-1">Fechar</v-btn>
        <v-btn variant="tonal" @click="applyPalette" :disabled="!selectedPalette">Aplicar Paleta</v-btn>
      </v-card-actions>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import Modal from '~/components/El/Modal/index.vue';
import { palettes } from './data/palettes';
import type { IPalette } from './type/palette';

const props = defineProps<{
  showPaletteModal: boolean;
  onClose: () => void;
}>();

const selectedPalette = ref<IPalette | null>(null); // Armazenar a paleta selecionada

const selectPalette = (palette: IPalette) => {
  selectedPalette.value = palette; // Armazena a paleta selecionada
};

const applyPalette = () => {
  if (selectedPalette.value) {
    document.documentElement.style.setProperty('--primary-color-100', selectedPalette.value.primaryColor);
    document.documentElement.style.setProperty('--primary-color-200', selectedPalette.value.primaryColor);
    document.documentElement.style.setProperty('--primary-color-300', selectedPalette.value.primaryColor);
    document.documentElement.style.setProperty('--primary-color-400', selectedPalette.value.primaryColor);
    document.documentElement.style.setProperty('--primary-color-500', selectedPalette.value.primaryColor);
    document.documentElement.style.setProperty('--primary-color-600', selectedPalette.value.primaryColor);
    document.documentElement.style.setProperty('--primary-color-700', selectedPalette.value.primaryColor);

    document.documentElement.style.setProperty('--secondary-color-100', selectedPalette.value.secondaryColor);
    document.documentElement.style.setProperty('--secondary-color-200', selectedPalette.value.secondaryColor);
    document.documentElement.style.setProperty('--secondary-color-300', selectedPalette.value.secondaryColor);
    document.documentElement.style.setProperty('--secondary-color-400', selectedPalette.value.secondaryColor);
    document.documentElement.style.setProperty('--secondary-color-500', selectedPalette.value.secondaryColor);
    document.documentElement.style.setProperty('--secondary-color-600', selectedPalette.value.secondaryColor);
    document.documentElement.style.setProperty('--secondary-color-700', selectedPalette.value.secondaryColor);

    if (props.onClose) props.onClose()
  }
};
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
