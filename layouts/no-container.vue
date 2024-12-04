<template>
  <VApp>
    <ElSnackbar />
    <MdHeader />
    <MdSubHeader />
    <MdScrollToTop />
    <slot />
    <MdFooter />
  </VApp>
</template>

<script setup>
const { getWhitelabel } = useWhitelabel()

callOnce(() => {
  getWhitelabel()
})
</script>

<style>
.slot {
  background-color: #f5f5f5;
}
</style>
