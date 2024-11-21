import { useServerStripe } from '#stripe/server'

export default defineEventHandler(async (event) => {
    const stripe = await useServerStripe(event)

    const { paymentIntentId, paymentMethodId } = await readBody(event)

    if (!paymentIntentId || !paymentMethodId) {
        return {
            success: false,
            error: 'PaymentIntent ID ou PaymentMethod ID não fornecidos',
        }
    }

    try {
        const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId, {
            payment_method: paymentMethodId
        })
        if (paymentIntent.status === 'succeeded') {
            return {
                success: true,
                message: 'Pagamento confirmado com sucesso!',
            }
        } else if (paymentIntent.status === 'requires_action') {
            return {
                success: false,
                error: 'Autenticação adicional necessária.',
            }
        } else {
            return {
                success: false,
                error: 'Falha ao confirmar o pagamento.',
            }
        }
    } catch (error) {
        console.error('Erro ao confirmar pagamento:', error)
        return {
            success: false,
            error: 'Erro ao confirmar pagamento no servidor.',
        }
    }
})
