module.exports = createShippingRates = () => {
    //Default shipping options
    let shippingOptions = [
        {
            shipping_rate_data: {
                type: 'fixed_amount',
                fixed_amount: { amount: 799, currency: 'usd'},
                display_name: 'USPS Priority shipping',
                delivery_estimate: {
                    minimum: { unit: 'business_day', value: 2 },
                    maximum: { unit: 'business_day', value: 5 }
                }
            }
        }
    ]
    return shippingOptions;
}

