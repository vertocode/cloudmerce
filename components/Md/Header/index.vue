<template>
  <header v-if="whitelabel?.name">
    <div class="header_container">
      <div class="logo_container">
        <img
          :src="whitelabel.logoUrl"
          alt="Logo"
          @click="$router.push('/')"
        >
      </div>

      <nav class="nav_links">
        <a
          v-for="type in productTypes"
          :key="type.id"
          class="nav_link"
          :class="{ active: isActiveType(type.id) }"
          @click="redirectTo(type.id)"
        >
          <VIcon
            v-if="type.icon"
            size="16"
          >
            {{ type.icon.includes('mdi') ? type.icon : `mdi-${type.icon}` }}
          </VIcon>
          {{ type.name }}
        </a>
      </nav>

      <div class="action_container">
        <UserButton />
        <CartButton />
        <MenuButton />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import UserButton from '~/components/Md/Header/UserButton.vue'
import CartButton from '~/components/Md/Header/CartButton.vue'
import MenuButton from '~/components/Md/Header/MenuButton.vue'

const { whitelabel } = useWhitelabel()
const { userData } = useUser()
const { productTypes } = useProductTypes()
const router = useRouter()
const route = useRoute()

const redirectTo = (type: string) => {
  router.push(`/product/type/${type}`)
}

const isActiveType = (type: string) => route.params.type === type
</script>

<style scoped lang="scss">
header {
  position: sticky;
  top: 0;
  z-index: 1000;
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: saturate(180%) blur(20px);
  -webkit-backdrop-filter: saturate(180%) blur(20px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);

  .header_container {
    max-width: 1440px;
    margin: 0 auto;
    padding: 0 24px;
    height: 44px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    @media screen and (max-width: 1024px) {
      padding: 0 16px;
    }

    .logo_container {
      display: flex;
      align-items: center;
      flex-shrink: 0;

      img {
        cursor: pointer;
        height: 32px;
        object-fit: contain;

        @media screen and (max-width: $mobile-breakpoint) {
          height: 28px;
        }
      }
    }

    .nav_links {
      display: flex;
      gap: 32px;
      align-items: center;
      flex: 1;
      justify-content: center;

      @media screen and (max-width: 768px) {
        display: none;
      }

      .nav_link {
        display: flex;
        align-items: center;
        gap: 4px;
        color: #1d1d1f;
        font-size: 12px;
        font-weight: 400;
        letter-spacing: -0.01em;
        cursor: pointer;
        transition: all 0.2s ease;
        text-decoration: none;
        white-space: nowrap;
        opacity: 0.8;

        :deep(.v-icon) {
          color: var(--primary-color);
        }

        &:hover {
          opacity: 1;
        }

        &.active {
          opacity: 1;
          font-weight: 500;
        }
      }
    }

    .action_container {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: 4px;
      flex-shrink: 0;

      :deep(.v-btn) {
        min-width: 36px;
        height: 36px;
      }
    }
  }
}
</style>
