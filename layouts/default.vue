<template>
  <VApp>
    <MdHeader />
    <MdSubHeader />
    <MdContainer class="main_container">
      <slot />
    </MdContainer>
    <MdFooter />
  </VApp>
</template>

<style>
.main_container {
  min-height: 60vh;
}
</style>
