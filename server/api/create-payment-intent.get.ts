import {useServerStripe} from "#stripe/server";

export default defineEventHandler(async (event) => {
    const stripe = await useServerStripe(event);
    const orderAmount = 50;
    let paymentIntent;

    try {
        paymentIntent = await stripe.paymentIntents.create({
            currency: "brl",
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
