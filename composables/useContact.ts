export const useContact = () => {
    const techEmail = 'evertonvanoni1@gmail.com'
    const whatsappNumber = '5535992712327'
    const whatsappLink = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=Ol%C3%A1%2C%20gostaria%20de%20saber%20mais%20sobre%20os%20produtos%20da%20loja.`
    const formattedWhatsappNumber = computed(() => {
        const number = whatsappNumber.replace(/^55/, '') // Remove o DDI
        return `(${number.slice(0, 2)}) ${number.slice(2, 7)}-${number.slice(7)}`
    })

    return {
        techEmail,
        formattedWhatsappNumber,
        whatsappLink
    }
}
