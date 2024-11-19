<template>
  <v-stepper
      v-model="step"
      class="steppers"
      :items="['Dados de Envio', 'Dados de Pagamento']"
      hide-actions
      v-slot="{ prev, next }"
  >
    <main class="content">
      <component :is="DynamicStep" :next :prev />
    </main>
  </v-stepper>
</template>

<script setup lang="ts">
import Step1 from './components/Step1.vue'
import Step2 from './components/Step2.vue'
import Step3 from './components/Step3.vue'

const step = ref(1)

const DynamicStep = computed(() => {
  switch (step.value) {
    case 1:
      return Step1
    case 2:
      return Step2
    case 3:
      return Step3
    default:
      handleError('Invalid step')
  }
})
</script>

<style lang="scss">
.steppers {
  height: max-content;
  margin: 16px 0;
  padding-bottom: 12px;

  .content {
    width: 100%;
    padding: 0 16px;

    .back-button {
      float: left;
    }

    .next-button {
      float: right;
    }
  }
}
</style>
