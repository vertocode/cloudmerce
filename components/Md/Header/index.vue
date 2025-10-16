<template>
  <header v-if="whitelabel?.name">
    <div class="header_container">
      <div class="logo_container">
        <img
          :src="whitelabel.logoUrl || '/logo.png'"
          alt="Logo"
          @click="$router.push('/')"
        >
      </div>

      <nav class="nav_links">
        <!-- Custom Menu Navigation Items -->
        <template v-if="useCustomMenu && navigationItems.length > 0">
          <div
            v-for="(item, index) in navigationItems"
            :key="index"
            class="nav_item_wrapper"
          >
            <a
              v-if="!item.children || item.children.length === 0"
              class="nav_link"
              :class="{ active: isActivePath(item.link) }"
              @click="navigateTo(item.link)"
            >
              {{ item.label }}
            </a>
            <div
              v-else
              class="nav_dropdown"
              @mouseenter="showDropdown(index)"
              @mouseleave="hideDropdown(index)"
            >
              <a
                class="nav_link"
                :class="{ active: isActivePath(item.link) }"
                @click="item.link && navigateTo(item.link)"
              >
                {{ item.label }}
                <VIcon size="16">mdi-chevron-down</VIcon>
              </a>
              <div
                v-show="activeDropdown === index"
                class="dropdown_menu"
              >
                <a
                  v-for="(child, childIndex) in item.children"
                  :key="childIndex"
                  class="dropdown_item"
                  @click="navigateTo(child.link)"
                >
                  {{ child.label }}
                </a>
              </div>
            </div>
          </div>
        </template>

        <!-- Default Menu (Product Types) -->
        <template v-else>
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
        </template>
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

// Custom menu configuration
const useCustomMenu = computed(() => whitelabel.value?.menu?.useCustomMenu || false)
const navigationItems = computed(() => whitelabel.value?.menu?.navigationItems || [])

// Dropdown state
const activeDropdown = ref<number | null>(null)

const showDropdown = (index: number) => {
  activeDropdown.value = index
}

const hideDropdown = (index: number) => {
  activeDropdown.value = null
}

// Navigation methods
const navigateTo = (link?: string) => {
  if (link) {
    router.push(link)
  }
}

const redirectTo = (type: string) => {
  router.push(`/product/type/${type}`)
}

const isActiveType = (type: string) => route.params.type === type

const isActivePath = (link?: string) => {
  if (!link) return false
  return route.path === link
}
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

      .nav_item_wrapper {
        position: relative;
      }

      .nav_dropdown {
        position: relative;

        .dropdown_menu {
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          margin-top: 8px;
          background-color: rgba(255, 255, 255, 0.95);
          backdrop-filter: saturate(180%) blur(20px);
          -webkit-backdrop-filter: saturate(180%) blur(20px);
          border-radius: 12px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
          min-width: 200px;
          padding: 8px;
          z-index: 1001;

          .dropdown_item {
            display: block;
            padding: 10px 16px;
            color: #1d1d1f;
            font-size: 12px;
            font-weight: 400;
            cursor: pointer;
            transition: background-color 0.2s ease;
            text-decoration: none;
            border-radius: 8px;
            white-space: nowrap;

            &:hover {
              background-color: rgba(0, 0, 0, 0.05);
            }
          }
        }
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
