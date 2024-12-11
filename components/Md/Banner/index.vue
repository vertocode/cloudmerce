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
@import url("https://use.typekit.net/eor8tme.css");

.banner {
  margin: auto;
  max-width: 1600px;
  background-color: var(--primary-color-500);
  position: relative;
  height: 500px;
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
      z-index: 2;
      width: 100%;
      display: flex;
      padding-left: 15%;
      justify-content: flex-start;
    }
  }
}

.banner-image {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  z-index: 1;
  height: 500px;
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
  max-width: 50%;
  text-align: center;
}

.banner-title {
  font-family: "muli", sans-serif;
  font-weight: 900;
  font-style: normal;
  font-size: 3.5rem;
  margin-bottom: 8px;
  color: #ffffff;
}

.banner-subtitle {
  font-family: "muli", sans-serif;
  font-weight: 400;
  font-style: normal;
  font-size: 1.5rem;
  margin-bottom: 30px;
  color: rgba(255, 255, 255, 0.9);
}

@media (max-width: 1200px) {
  .banner-title {
    font-size: 3rem;
  }

  .banner-subtitle {
    font-size: 1.3rem;
  }
}

@media (max-width: 768px) {
  .container {
    z-index: 2;
    width: 100%;
    display: flex;
    justify-content: flex-start;
    padding-left: 10px !important;
  }

  .banner-image {
    opacity: 30%;
  }

  .banner-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 100%;
    text-align: center;
  }

  .banner-title {
    font-size: 2.5rem;
  }

  .banner-subtitle {
    font-size: 1.3rem;
  }
}
</style>
