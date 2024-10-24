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
</style>
