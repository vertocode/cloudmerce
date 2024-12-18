<template>
  <div
    class="card"
    v-bind="$attrs"
  >
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.card {
  width: 100%;
  background-color: #f5f5f5;
  padding: 12px;
  border-radius: 8px;
}
</style>
