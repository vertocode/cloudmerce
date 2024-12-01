<template>
  <div class="banner">
    <div class="banner-content">
      <h1 class="banner-title">
        Produtos de <span class="highlight">Qualidade</span> para Você
      </h1>
      <p class="banner-subtitle">
        Tudo o que você precisa, a um clique de distância
      </p>
      <div class="payment-options">
        <div class="option">
          <VIcon
            large
            class="icon pix-icon"
          >
            mdi-cash
          </VIcon>
          <span>Desconto no Pix</span>
        </div>
        <div class="option">
          <VIcon
            large
            class="icon credit-card-icon"
          >
            mdi-credit-card
          </VIcon>
          <span>Cartão de Crédito Aceito</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.banner {
  background: url('assets/banner.png') no-repeat center;
  background-size: cover;
  padding: 60px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
  color: #ffffff;
  width: 100%;
  border-radius: 0;
}

.banner-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 700px;
  text-align: center;
}

.banner-title {
  font-size: 2.5rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: #ffffff;
}

.highlight {
  color: #FFD700;
  font-weight: 600;
}

.banner-subtitle {
  font-size: 1.2rem;
  font-weight: 400;
  margin-bottom: 30px;
  color: rgba(255, 255, 255, 0.9);
}

.payment-options {
  display: flex;
  gap: 20px;
  margin-top: 20px;
}

.option {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1rem;
  font-weight: 400;
  background-color: rgba(255, 255, 255, 0.2);
  padding: 12px 24px;
  border-radius: 8px;
  transition: background-color 0.3s ease, transform 0.3s ease;
  color: #ffffff;
}

.option:hover {
  background-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.icon {
  color: #FFD700;
  background-color: rgba(0, 0, 0, 0.1);
  padding: 12px;
  border-radius: 50%;
}

@media (max-width: 768px) {
  .banner-title {
    font-size: 2rem;
  }

  .banner-subtitle {
    font-size: 1rem;
  }

  .payment-options {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .banner-title {
    font-size: 1.8rem;
  }

  .banner-subtitle {
    font-size: 0.9rem;
  }

  .option {
    font-size: 0.9rem;
    padding: 10px 20px;
  }

  .icon {
    font-size: 22px;
    padding: 10px;
  }
}
</style>
