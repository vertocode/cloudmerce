<template>
  <main class="error">
    <h1>Erro</h1>
    <p>Desculpe, ocorreu um erro para se comunicar com o servidor, tente novamente mais tarde.</p>
    <VBtn
      class="refresh-btn"
      @click="$router.push('/')"
    >
      Tentar novamente
    </VBtn>
  </main>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'no-layout',
})
</script>

<style lang="scss">
$error-color: #e74c3c;
$text-color: #333;
$background-color: #f8d7da;
$border-color: #f5c6cb;
$button-bg-color: #e74c3c;
$button-hover-bg: #c0392b;

$error-padding: 20px;
$border-radius: 8px;
$button-radius: 5px;

.error {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: $background-color;
  border: 1px solid $border-color;
  border-radius: $border-radius;
  padding: $error-padding;
  width: 90%;
  max-width: 600px;
  margin: 50px auto;
  text-align: center;

  h1 {
    font-size: 2rem;
    color: $error-color;
    margin-bottom: 10px;
    font-weight: bold;
  }

  p {
    font-size: 1.1rem;
    color: $text-color;
    line-height: 1.5;
  }

  animation: fadeIn 0.3s ease-in-out;
}

.refresh-btn {
  background-color: $button-bg-color;
  color: #fff;
  border: none;
  padding: 12px 25px;
  font-size: 1rem;
  font-weight: bold;
  border-radius: $button-radius;
  cursor: pointer;
  margin-top: 20px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: $button-hover-bg;
  }

  &:focus {
    outline: none;
  }
}

@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
