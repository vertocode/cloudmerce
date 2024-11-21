export default defineEventHandler(async (event) => {
    const stripe = await useServerStripe(event);
    const orderAmount = 1400;
    let paymentIntent;

    try {
        paymentIntent = await stripe.paymentIntents.create({
            currency: "usd",
            amount: orderAmount,
            automatic_payment_methods: { enabled: true },
        });

        return {
            clientSecret: paymentIntent.client_secret,
            error: null,
        };
    } catch (e) {
        return {
            clientSecret: null,
            error: e,
        };
    }
});
