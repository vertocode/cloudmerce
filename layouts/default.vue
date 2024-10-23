<template>
  <VApp>
    <MdHeader />
    <MdContainer class="main_container">
      <slot />
    </MdContainer>
    <MdFooter />
  </VApp>
</template>

<style>
.main_container {
  min-height: 80vh;
}

.v-row {
  margin: 0 !important;
}

.v-col {
  padding: 0 !important;
}
</style>
