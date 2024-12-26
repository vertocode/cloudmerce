<template>
  <main class="whitelabel-configuration">
    <h1>Configuração do seu E-Commerce!</h1>
    <p>Detectamos que o URL acessado ainda não possui um e-commerce da Cloudmerce configurado. No entanto, você pode realizar a configuração imediatamente no formulário abaixo.</p>
    <p>Caso você acredite que este seja um erro, por favor, entre em contato conosco utilizando o formulário de contato disponível ao final da página.</p>
    <div>
      <h2>Formulário para configuração</h2>
      <br>
      <ClientOnly>
        <MdWhitelabelConfigurationForm />
      </ClientOnly>
    </div>
    <VExpansionPanels>
      <VExpansionPanel>
        <VExpansionPanelTitle>
          Contato
        </VExpansionPanelTitle>
        <VExpansionPanelText>
          <ElContactForm />
        </VExpansionPanelText>
      </VExpansionPanel>
    </VExpansionPanels>
  </main>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'no-layout',
  middleware: ['03-admin-auth'],
})
</script>

<style lang="scss">
$primary-color: #007BFF;
$secondary-color: #f8f9fa;
$background-color: #f4f6f9;
$text-color: #343a40;
$font-family: 'Arial', sans-serif;

.whitelabel-configuration {
  font-family: $font-family;
  color: $text-color;
  line-height: 1.6;
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  *,
  *::before,
  *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
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
}
</style>
