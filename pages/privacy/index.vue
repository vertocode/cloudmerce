<template>
  <div class="privacy-page">
    <h1 class="privacy-title">
      Política de Privacidade
    </h1>
    <p>
      Bem-vindo à nossa loja! Nossa política de privacidade garante a proteção dos seus dados pessoais enquanto você navega e realiza compras em nossa plataforma.
      Estamos comprometidos com a segurança e a transparência das informações fornecidas por você.
    </p>

    <section class="privacy-section">
      <h2>1. Coleta de Dados Pessoais</h2>
      <p>
        Durante sua experiência de compra, coletamos dados necessários para efetuar as transações, como nome, endereço de entrega, e informações de pagamento.
        Estes dados são armazenados de forma segura e somente utilizados para processamento e entrega dos pedidos.
      </p>
    </section>

    <section class="privacy-section">
      <h2>2. Uso dos Dados</h2>
      <p>
        Os dados coletados são utilizados para melhorar sua experiência de compra, personalizar ofertas, e garantir a entrega dos produtos.
        Somente compartilhamos suas informações com terceiros confiáveis quando necessário para completar os serviços, como empresas de logística e processadores de pagamento.
      </p>
    </section>

    <section class="privacy-section">
      <h2>3. Segurança</h2>
      <p>
        Adotamos medidas de segurança rigorosas para proteger seus dados contra acessos não autorizados.
        Todos os dados financeiros são criptografados para garantir a segurança das transações realizadas em nossa plataforma.
      </p>
    </section>

    <section class="privacy-section">
      <h2>4. Alterações na Política</h2>
      <p>
        Podemos atualizar nossa política de privacidade periodicamente para refletir mudanças nas práticas de uso de dados ou requisitos legais.
        Recomendamos revisar esta página regularmente para se manter informado.
      </p>
    </section>

    <p class="privacy-contact">
      Caso tenha dúvidas ou preocupações sobre nossa política de privacidade, entre em contato conosco pelo e-mail <a :href="`mailto:${techEmail}`">{{ techEmail }}</a>.
    </p>
  </div>
</template>

<script setup lang="ts">
const { techEmail } = useContact()
</script>

<style scoped lang="scss">
.privacy-page {
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
  color: #333;
  line-height: 1.6;
  font-size: 18px;

  .privacy-title {
    font-size: 32px;
    font-weight: bold;
    margin-bottom: 24px;
    color: var(--primary-color-500);
    text-align: center;
  }

  .privacy-section {
    margin-bottom: 24px;

    h2 {
      font-size: 24px;
      font-weight: 600;
      color: var(--primary-color-600);
      margin-bottom: 8px;
    }

    p {
      margin-bottom: 16px;
    }
  }

  .privacy-contact {
    text-align: center;
    margin-top: 32px;
    font-size: 16px;

    a {
      color: var(--primary-color-500);
      font-weight: bold;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }
}
</style>
