<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-grid">
        <!-- Brand Section -->
        <div class="footer-section brand-section">
          <div class="footer-logo">
            <img
              :src="whitelabel?.logoUrl || '/logo.png'"
              :alt="whitelabel?.name || 'Logo'"
              @click="$router.push('/')"
            >
          </div>
          <p class="brand-description">
            {{ whitelabel?.description || 'Sua loja online de confiança' }}
          </p>
          <div
            v-if="hasSocialMedia"
            class="social-media"
          >
            <MdSocialMediaIcons />
          </div>
        </div>

        <!-- Product Types -->
        <div
          v-if="productTypes.length > 0"
          class="footer-section"
        >
          <h3 class="footer-title">
            Categorias
          </h3>
          <ul class="footer-list">
            <li
              v-for="type in productTypes.slice(0, 12)"
              :key="type.id"
            >
              <NuxtLink :to="`/?productType=${type.id}`">
                {{ type.name }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Custom Pages -->
        <div
          v-if="customPages.length > 0"
          class="footer-section"
        >
          <h3 class="footer-title">
            Páginas
          </h3>
          <ul class="footer-list">
            <li
              v-for="page in customPages.slice(0, 12)"
              :key="page._id"
            >
              <NuxtLink :to="`/pages/${page.handle}`">
                {{ page.title }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Quick Links -->
        <div class="footer-section">
          <h3 class="footer-title">
            Links Úteis
          </h3>
          <ul class="footer-list">
            <li v-if="isLoggedIn">
              <NuxtLink to="/orders">
                Meus Pedidos
              </NuxtLink>
            </li>
            <li v-if="isAdmin">
              <NuxtLink to="/admin">
                Painel Admin
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/about">
                Sobre Nós
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/contact">
                Contato
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/privacy">
                Termos e Privacidade
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <p>&copy; {{ new Date().getFullYear() }} {{ whitelabel?.name }}. Todos os direitos reservados.</p>
    </div>
  </footer>
</template>

<script setup lang="ts">
const { isAdmin, isLoggedIn } = useUser()
const { whitelabel } = useWhitelabel()
const { productTypes } = useProductTypes()
const { pages } = usePages()

// Fetch pages on component mount
onMounted(async () => {
  const { fetchPages } = usePages()
  try {
    await fetchPages()
    console.log('[Footer] Pages fetched:', pages.value)
  } catch (error) {
    console.error('[Footer] Error fetching pages:', error)
  }
})

// Filter only active pages
const customPages = computed(() => {
  const filtered = pages.value.filter(page => page.isActive)
  console.log('[Footer] Custom pages filtered:', filtered)
  return filtered
})

// Check if any social media is filled
const hasSocialMedia = computed(() => {
  const social = whitelabel.value?.socialMedia
  return !!(social?.wpp || social?.instagram || social?.twitter)
})
</script>

<style scoped lang="scss">
.footer {
  background: var(--primary-color-700);
  color: white;
  padding: 64px 0 0;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.15);

  .footer-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px 48px;
  }

  .footer-grid {
    display: grid;
    grid-template-columns: 1.5fr repeat(3, 1fr);
    gap: 48px;
  }

  .footer-section {
    .footer-title {
      font-size: 1.125rem;
      font-weight: 600;
      margin-bottom: 20px;
      color: white;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .footer-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
      gap: 8px 16px;

      li {
        margin-bottom: 12px;

        a, span {
          color: rgba(255, 255, 255, 0.85);
          text-decoration: none;
          font-size: 0.9375rem;
          transition: all 0.3s ease;
          display: inline-block;

          &:hover {
            color: var(--secondary-color-300);
            transform: translateX(4px);
          }
        }
      }

      &.contact-list {
        display: flex;
        flex-direction: column;
        gap: 12px;

        li {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 0;

          .contact-icon {
            color: var(--secondary-color-300);
          }

          a {
            &:hover {
              transform: none;
              text-decoration: underline;
            }
          }
        }
      }
    }
  }

  .brand-section {
    .footer-logo {
      padding: 20px;
      background-color: #fff;
      border-radius: 12px;
      display: inline-block;
      margin-bottom: 16px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

      img {
        mix-blend-mode: darken;
        max-width: 120px;
        height: auto;
        cursor: pointer;
        transition: transform 0.3s ease;

        &:hover {
          transform: scale(1.05);
        }
      }
    }

    .brand-description {
      font-size: 0.9375rem;
      line-height: 1.6;
      color: rgba(255, 255, 255, 0.85);
      margin-bottom: 24px;
      max-width: 300px;
    }

    .social-media {
      margin-top: 20px;
    }
  }

  .footer-bottom {
    border-top: 1px solid rgba(255, 255, 255, 0.2);
    padding: 24px;
    text-align: center;

    p {
      margin: 0;
      font-size: 0.875rem;
      color: rgba(255, 255, 255, 0.7);
    }
  }
}

// Tablet
@media (max-width: 768px) {
  .footer {
    padding: 48px 0 0;

    .footer-content {
      padding: 0 20px 32px;
    }

    .footer-grid {
      grid-template-columns: repeat(3, 1fr);
      gap: 32px;
    }

    .brand-section {
      grid-column: 1 / -1;
      text-align: center;

      .footer-logo {
        margin-bottom: 12px;
      }

      .brand-description {
        max-width: 100%;
      }

      .social-media {
        display: flex;
        justify-content: center;
      }
    }

    .footer-section {
      .footer-title {
        font-size: 1rem;
        margin-bottom: 16px;
      }

      .footer-list {
        grid-template-columns: 1fr;

        li {
          margin-bottom: 10px;

          a, span {
            font-size: 0.875rem;
          }
        }
      }
    }
  }
}

// Mobile
@media (max-width: 480px) {
  .footer {
    padding: 32px 0 0;

    .footer-content {
      padding: 0 16px 24px;
    }

    .footer-grid {
      grid-template-columns: 1fr;
      gap: 32px;
    }

    .footer-section {
      .footer-title {
        font-size: 0.9375rem;
        margin-bottom: 12px;
      }

      .footer-list {
        grid-template-columns: 1fr;

        li {
          margin-bottom: 8px;

          a, span {
            font-size: 0.8125rem;
          }

          &:hover a {
            transform: translateX(2px);
          }
        }
      }
    }

    .brand-section {
      .footer-logo {
        padding: 16px;

        img {
          max-width: 100px;
        }
      }

      .brand-description {
        font-size: 0.875rem;
      }
    }

    .footer-bottom {
      padding: 16px;

      p {
        font-size: 0.75rem;
      }
    }
  }
}
</style>
