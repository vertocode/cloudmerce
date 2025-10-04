<template>
  <VApp>
    <ElSnackbar />
    <MdHeader />
    <MdScrollToTop />
    <MdContainer class="main_container">
      <slot />
    </MdContainer>
    <MdFooter />
  </VApp>
</template>

<style>
.slot {
  background-color: #f5f5f5;
}

.main_container {
  min-height: 60vh;
}
</style>
