<template>
  <footer class="footer">
    <div class="footer-container">
      <div class="footer-logo">
        <img
          :src="whitelabel?.logoUrl"
          alt="Logo"
          @click="$router.push('/')"
        >
      </div>

      <div class="footer-links">
        <VBtn
          variant="text"
          @click="$router.push('/about')"
        >
          Sobre Nós
        </VBtn>
        <VBtn
          variant="text"
          @click="$router.push('/privacy')"
        >
          Política de Privacidade
        </VBtn>
        <VBtn
          variant="text"
          @click="$router.push('/contact')"
        >
          Contato
        </VBtn>
        <VBtn
          v-if="isAdmin"
          variant="text"
          @click="$router.push('/product-type')"
        >
          Tipos de Produto
        </VBtn>
        <VBtn
          v-if="isAdmin"
          variant="text"
          @click="$router.push('/register-new-product')"
        >
          Cadastrar Novo Produto
        </VBtn>
        <VBtn
          v-if="isAdmin"
          variant="text"
          @click="$router.push('/edit-whitelabel')"
        >
          Configurações do E-Commerce
        </VBtn>
      </div>

      <div class="footer-contact">
        <p v-if="storeEmail">
          Contato: {{ storeEmail }}
        </p>
        <p v-if="formattedWhatsappNumber">
          Telefone: {{ formattedWhatsappNumber }}
        </p>
      </div>

      <MdSocialMediaIcons />
    </div>
    <div class="footer-bottom">
      <p>&copy; {{ new Date().getFullYear() }} {{ whitelabel?.name }}. Todos os direitos reservados.</p>
    </div>
  </footer>
</template>

<script setup lang="ts">
const { storeEmail, formattedWhatsappNumber } = useContact()
const { isAdmin } = useUser()

const { whitelabel } = useWhitelabel()
</script>

<style scoped lang="scss">
.footer {
  background: var(--primary-color-700);
  color: white;
  padding: 32px 0;
  text-align: center;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.15);

  .footer-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    margin-bottom: 24px;

    .footer-logo {
      padding: 24px;
      background-color: #fff;
      border-radius: 8px;

      img {
        mix-blend-mode: darken;
        max-width: 100px;
        cursor: pointer;
      }
    }

    .footer-links {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 16px;

      .v-btn {
        color: white;
        font-size: 16px;

        &:hover {
          color: var(--secondary-color-300);
        }
      }
    }

    .footer-contact {
      font-size: 16px;
      line-height: 1.6;
    }
  }

  .footer-bottom {
    border-top: 1px solid rgba(255, 255, 255, 0.2);
    padding-top: 12px;
    font-size: 14px;
  }
}

@media (max-width: 768px) {
  .footer-links {
    flex-direction: column;
    gap: 8px;

    .v-btn {
      font-size: 14px;
    }
  }

  .footer-contact {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .footer-links {
    .v-btn {
      font-size: 12px;
    }
  }

  .footer-contact {
    font-size: 12px;
  }

  .footer-bottom {
    font-size: 12px;
  }
}
</style>
