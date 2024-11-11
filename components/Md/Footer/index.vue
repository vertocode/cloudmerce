<template>
  <footer class="footer">
    <div class="footer-container">
      <div class="footer-logo">
        <img
            :src="storeLogo"
            alt="Logo"
            @click="$router.push('/')"
        />
      </div>

      <div class="footer-links">
        <VBtn variant="text" @click="$router.push('/about')">Sobre Nós</VBtn>
        <VBtn variant="text" @click="$router.push('/privacy')">Política de Privacidade</VBtn>
        <VBtn variant="text" @click="$router.push('/contact')">Contato</VBtn>
        <VBtn v-if="isAdmin" variant="text" @click="showProductTypeModal = true">Tipos de Produto</VBtn>
        <VBtn v-if="isAdmin" variant="text" @click="showProductModal = true">Cadastrar Novo Produto</VBtn>
        <VBtn v-if="isAdmin" variant="text" @click="showPaletteModal = true">Configurações de Paleta</VBtn>
      </div>

      <div class="footer-contact">
        <p>Contato: {{ techEmail }}</p>
        <p>Telefone: {{ formattedWhatsappNumber }}</p>
      </div>

      <MdSocialMediaIcons />
    </div>
    <div class="footer-bottom">
      <p>&copy; {{ new Date().getFullYear() }} {{ storeName }}. Todos os direitos reservados.</p>
    </div>
  </footer>
  <MdPaletteModal :show-palette-modal="showPaletteModal" :on-close="() => showPaletteModal = false"/>
  <MdManageProductType :showProductTypeModal="showProductTypeModal" :onClose="() => showProductTypeModal = false" />
  <MdRegisterProductModal
      :showRegisterModal="showProductModal"
      :onClose="() => showProductModal = false"
      :on-register-new-product-type="onRegisterNewProductType"
  />
</template>

<script setup lang="ts">
const { techEmail, formattedWhatsappNumber } = useContact()
const { storeLogo, storeName } = useStoreData()
const { isAdmin } = useUser()

const showPaletteModal = ref(false)
const showProductTypeModal = ref(false)
const showProductModal = ref(false)

const onRegisterNewProductType = () => {
  showProductModal.value = false
  showProductTypeModal.value = true
}
</script>

<style scoped lang="scss">
.footer {
  background: linear-gradient(135deg, var(--primary-color-700), var(--primary-color-500));
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

    .footer-logo img {
      max-width: 100px;
      cursor: pointer;
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
