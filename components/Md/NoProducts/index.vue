<template>
  <div class="no-products">
    <VIcon
      large
      class="no-products-icon"
    >
      mdi-package-variant
    </VIcon>
    <h3 class="no-products-title">
      Nenhum produto encontrado
    </h3>
    <p class="no-products-message">
      Não há produtos disponíveis {{ filterSearchProducts ? 'de acordo com os filtros selecionados' : 'nesta categoria' }}.
    </p>

    <div class="button-group">
      <VBtn
        v-if="filterSearchProducts"
        color="primary"
        class="clean-btn"
        @click="filterSearchProducts = ''"
      >
        Limpar Filtros
      </VBtn>
      <VBtn
        v-if="!filterSearchProducts"
        color="primary"
        class="retry-btn"
        @click="$emit('retry')"
      >
        Tentar Novamente
      </VBtn>
      <VBtn
        v-if="!filterSearchProducts"
        color="secondary"
        class="home-btn"
        @click="$emit('goHome')"
      >
        Buscar por outro tipo de produto
      </VBtn>
    </div>
  </div>
</template>

<script setup lang="ts">
const filterSearchProducts = useState<string>('filterSearchProducts')
</script>

<style lang="scss" scoped>
.no-products {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  text-align: center;
  color: #555;

  .no-products-icon {
    font-size: 3rem;
    margin-bottom: 16px;
    color: var(--primary-color-500);
  }

  .no-products-title {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 8px;
  }

  .no-products-message {
    font-size: 1rem;
    margin-bottom: 24px;
    color: #777;
  }

  .button-group {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 16px;

    .retry-btn {
      background-color: var(--primary-color-500);
      color: white;

      &:hover {
        background-color: var(--primary-color-600);
      }
    }

    .home-btn {
      background-color: var(--secondary-color-500);
      color: white;

      &:hover {
        background-color: var(--secondary-color-600);
      }
    }
  }
}
</style>
