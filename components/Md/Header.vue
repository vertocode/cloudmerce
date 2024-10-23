<template>
  <header>
    <MdContainer class="header_container">
      <div class="logo_container">
        <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHl61Sy02jzSLGguydQ4lNQvMlYGJn1tOSRQ&s"
            alt="My App"
        />
      </div>

      <div class="link_container">
        <nuxt-link
            v-for="link in links"
            :key="link.to"
            :to="link.to"
        >
          {{ link.name }}
        </nuxt-link>
      </div>

      <div class="action_container">

      </div>
    </MdContainer>
  </header>
</template>

<script setup lang="ts">
const links = [
  { name: 'Home', to: '/' },
  { name: 'About', to: '/about' },
]
</script>

<style scoped lang="scss">
header {
  color: white;
  padding: 4px 0;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  .header_container {
    display: flex;
    justify-content: space-between;

    .logo_container {
      img {
        max-width: 60px;
        max-height: 60px;
      }
    }
  }
}
</style>
