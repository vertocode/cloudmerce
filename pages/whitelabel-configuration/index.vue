<template>
  <main>
    <h1>Configuração do seu E-Commerce!</h1>
    <p>Detectamos que o URL acessado ainda não possui um e-commerce da Cloudmerce configurado. No entanto, você pode realizar a configuração imediatamente no formulário abaixo.</p>
    <p>Caso você acredite que este seja um erro, por favor, entre em contato conosco utilizando o formulário de contato disponível ao final da página.</p>
    <div>
      <h2>Formulário para configuração</h2>
      <MdWhitelabelConfigurationForm />
    </div>
    <div>
      <h2>Contato caso precise: </h2>
      <ElContactForm />
    </div>
  </main>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'no-layout',
})
</script>

<style lang="scss">
// Variáveis para cores e tipografia
$primary-color: #007BFF;
$secondary-color: #f8f9fa;
$background-color: #f4f6f9;
$text-color: #343a40;
$font-family: 'Arial', sans-serif;

*,
*::before,
*::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: $font-family;
  background-color: $background-color;
  color: $text-color;
  line-height: 1.6;
  padding: 20px;
}

main {
  max-width: 960px;
  margin: 0 auto;
  padding: 40px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h1 {
  font-size: 2.5rem;
  color: $primary-color;
  margin-bottom: 20px;
  text-align: center;
}

p {
  font-size: 1.1rem;
  margin-bottom: 20px;
  line-height: 1.8;
  color: $text-color;

  &.highlight {
    font-weight: bold;
    color: $primary-color;
  }
}

form {
  display: flex;
  flex-direction: column;
  gap: 20px;

  input,
  textarea {
    padding: 12px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 1rem;
    outline: none;
    transition: border-color 0.3s;

    &:focus {
      border-color: $primary-color;
    }
  }

  button {
    padding: 14px 20px;
    background-color: $primary-color;
    color: #ffffff;
    border: none;
    border-radius: 5px;
    font-size: 1.1rem;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
      background-color: darken($primary-color, 10%);
    }
  }
}

footer {
  text-align: center;
  margin-top: 40px;
  font-size: 0.9rem;
  color: $text-color;
}

@media (max-width: 768px) {
  h1 {
    font-size: 2rem;
  }

  p {
    font-size: 1rem;
  }

  form {
    gap: 15px;
  }
}
</style>
