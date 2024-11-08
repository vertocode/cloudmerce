<template>
  <div class="banner">
    <VIcon large class="banner-icon">mdi-cart</VIcon>
    <div class="banner-content">
      <h1 class="banner-title">
        Produtos de <span class="highlight">Qualidade</span> para Você!
      </h1>
      <div class="payment-options">
        <div class="option">
          <VIcon class="pix-icon">mdi-cash</VIcon>
          <span>Desconto no Pix</span>
        </div>
        <div class="option">
          <VIcon class="credit-card-icon">mdi-credit-card</VIcon>
          <span>Aceitamos Cartão de Crédito</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.banner {
  text-align: center;
  margin-top: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 40px;
  background: linear-gradient(135deg, var(--primary-color-500), var(--primary-color-700));
  color: white;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.banner-icon {
  color: white;
  font-size: 120px;
  margin-right: 24px;
}

.banner-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.banner-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 20px;
}

.highlight {
  color: var(--secondary-color-500);
  font-weight: bold;
}

.payment-options {
  display: flex;
  gap: 24px;
  align-items: center;
}

.option {
  padding: 4px;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.option span {
  font-size: 20px;
  font-weight: 500;
}

.pix-icon, .credit-card-icon {
  font-size: 28px;
  color: white;
  background: rgba(0, 0, 0, 0.2);
  padding: 16px;
  border-radius: 50%;
}

@media (max-width: $tablet-breakpoint) {
  .banner-icon {
    font-size: 80px;
  }

  .banner-title {
    font-size: 1.7rem;
  }

  .option span {
    font-size: .8rem;
  }

  .pix-icon, .credit-card-icon {
    font-size: 16px;
    padding: 12px;
  }
}

@media (max-width: $mobile-breakpoint) {
  .banner-icon {
    font-size: 60px;
  }

  .banner-title {
    font-size: 1.5rem;
  }

  .option span {
    font-size: .7rem;
  }

  .pix-icon, .credit-card-icon {
    font-size: 14px;
    padding: 8px;
  }
}

@media (max-width: $md-mobile-breakpoint) {
  .banner {
    padding: 24px;
  }

  .banner-icon {
    font-size: 36px;
  }

  .banner-title {
    font-size: 1.2rem;
  }

  .option span {
    font-size: .6rem;
  }

  .pix-icon, .credit-card-icon {
    font-size: 12px;
    padding: 6px;
  }
}

@media (max-width: $sm-mobile-breakpoint) {
  .banner {
    flex-wrap: wrap;
    gap: 16px;
  }
}
</style>
