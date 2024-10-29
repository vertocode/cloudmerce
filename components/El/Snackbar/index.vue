<template>
  <v-snackbar
      v-model="snackbar.open"
      color="#D3D3D3"
      location="top right"
      variant="flat"
      :timeout="timeout"
  >
    <div class="snackbar">
      <v-icon left :style="{ color: computedColor }">{{ computedIcon }}</v-icon>
      <span class="snackbar-message" :style="{ color: computedColor }">{{ snackbar.message }}</span>
    </div>
  </v-snackbar>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const { snackbar, timeout } = useSnackbar();

const computedColor = computed(() => {
  switch (snackbar.variant) {
    case 'error':
      return '#f44336';
    case 'warning':
      return '#ffeb3b';
    case 'info':
      return '#2196f3';
    case 'success':
      return '#4caf50';
    default:
      return '';
  }
});

const computedIcon = computed(() => {
  switch (snackbar.variant) {
    case 'error':
      return 'mdi-alert-circle';
    case 'warning':
      return 'mdi-alert';
    case 'info':
      return 'mdi-information';
    case 'success':
      return 'mdi-check-circle';
    default:
      return '';
  }
});
</script>

<style scoped>
.snackbar {
  font-size: 16px;
}

.snackbar-message {
  margin-left: 8px;
}
</style>
