<template>
  <div class="banner">
    <div class="banner-image">
      <img
        src="~/assets/banner-image.png"
        alt="banner-image"
      >
    </div>
    <div class="gradient">
      <MdContainer class="container">
        <div class="banner-content">
          <h1 class="banner-title">
            {{ whitelabel?.banner?.title }}
          </h1>
          <p class="banner-subtitle">
            {{ whitelabel?.banner?.description }}
          </p>
          <div class="payment-options">
            <div class="option">
              <VIcon
                large
                class="icon pix-icon"
              >
                mdi-cash
              </VIcon>
              <span>Pix</span>
            </div>
            <div class="option">
              <VIcon
                large
                class="icon credit-card-icon"
              >
                mdi-credit-card
              </VIcon>
              <span>Cartão de Crédito</span>
            </div>
          </div>
        </div>
      </MdContainer>
    </div>
  </div>
</template>

<script setup lang="ts">
const { getWhitelabel } = useWhitelabel()

const whitelabel = await getWhitelabel()
</script>

<style scoped lang="scss">
.banner {
  background-color: var(--primary-color-500);
  position: relative;
  height: 350px;
  padding: 60px 120px;
  display: block;
  width: 100%;
  border-radius: 0;

  .gradient {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(86.28deg, var(--primary-color-400) 10.21%, var(--primary-color-600) 32.99%, var(--primary-color-600) 56.02%, var(--primary-color-400) 127.2%);

    .container {
      width: 100%;
      display: flex;
      justify-content: center;
    }
  }
}

.banner-image {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  z-index: 1;
  height: 300px;
  opacity: 50%;
  object-fit: contain;

  img {
    object-fit: fill;
    width: 100%;
    height: 100%;
  }
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
  color: #fff;
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
