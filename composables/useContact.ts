export const useContact = () => {
  const { whitelabel } = useWhitelabel()
  const storeEmail = whitelabel.value?.contact?.email
  const whatsappNumber = whitelabel.value?.socialMedia?.wpp
  const whatsappLink = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=Ol%C3%A1%2C%20gostaria%20de%20saber%20mais%20sobre%20os%20produtos%20da%20loja.`
  const formattedWhatsappNumber = computed(() => {
    if (!whatsappNumber) return ''

    const number = whatsappNumber.replace(/^55/, '') // Remove o DDI
    return `(${number.slice(0, 2)}) ${number.slice(2, 7)}-${number.slice(7)}`
  })

  return {
    storeEmail,
    formattedWhatsappNumber,
    whatsappLink,
  }
}
