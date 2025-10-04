<template>
  <VApp>
    <ElSnackbar />
    <MdHeader />
    <MdScrollToTop />
    <slot />
    <MdFooter />
  </VApp>
</template>

<style>
.slot {
  background-color: #f5f5f5;
}
</style>
