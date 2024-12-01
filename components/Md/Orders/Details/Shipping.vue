<template>
  <div class="shipping-details">
    <h4>Detalhes de Envio</h4>

    <div
      v-if="addressData"
      class="address-summary"
    >
      <div class="address-row">
        <span class="label">CEP:</span>
        <span class="value">{{ addressData.cep }}</span>
      </div>
      <div class="address-row">
        <span class="label">Endereço:</span>
        <span class="value">
          {{ addressData.neighborhood }} - {{ addressData.street }}, {{ addressData.number }}
        </span>
      </div>
      <div class="address-row">
        <span class="label">Cidade:</span>
        <span class="value">{{ addressData.city }}</span>
      </div>
      <div class="address-row">
        <span class="label">Estado:</span>
        <span class="value">{{ addressData.state }}</span>
      </div>
      <div class="address-row">
        <span class="label">País:</span>
        <span class="value">{{ addressData.country || 'Brasil' }}</span>
      </div>
    </div>

    <div
      v-else
      class="no-address"
    >
      <span>Não há endereço cadastrado.</span>
    </div>
  </div>
</template>

<script setup lang="ts">
const { userData } = useUser()

const addressData = computed(() => userData.value?.address)
</script>

<style scoped lang="scss">
.shipping-details {
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 16px;
  margin: 16px 0;

  h4 {
    margin-bottom: 16px;
  }

  .address-summary {
    .address-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;

      .label {
        font-weight: bold;
        color: #616161;
      }

      .value {
        color: #212121;
        text-align: right;
      }
    }
  }

  .no-address {
    text-align: center;
    color: #9e9e9e;
    font-style: italic;
    margin-top: 12px;
  }
}
</style>
