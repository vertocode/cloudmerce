<template>
  <div>
    <MdProductDetails :product="product" />
  </div>
</template>

<script setup lang="ts">
const product = {
  name: "Smartphone XYZ",
  price: 3499.99,
  description: "O Smartphone XYZ combina desempenho e elegância. Conta com processador avançado, câmera tripla de alta resolução e bateria de longa duração. Ideal para quem busca tecnologia de ponta.",
  image: ["https://http2.mlstatic.com/D_NQ_NP_922013-MLM51559385450_092022-O.webp"], // Substitua pela URL real de uma imagem.
  fields: [
    {
      label: "Cores disponíveis",
      type: "options",
      options: ["Preto", "Prata", "Azul"],
    },
    {
      label: "Armazenamento",
      type: "options",
      options: ["64GB", "128GB", "256GB"],
    },
  ],
};
</script>
