<template>
  <VApp>
    <ElSnackbar />
    <MdHeader  />
    <MdSubHeader />
    <MdScrollToTop />
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
