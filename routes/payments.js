const router = require('@koa/router')();
const stripe = require('stripe')(process.env.STRIPE_API_KEY);

router.get("/payments", async ctx => {
  ctx.body = "Please make request using POST.";
});

router.post("/payments", async ctx => {

  const data = ctx.request.body;

  const items = data.items.map(item => ({
    price_data: {
      currency: data.currency,
      product_data: {
        name: item.name,
        images: item.images
      },
      unit_amount_decimal: item.price * 100,
    },
    quantity: item.quantity
  }));

  items.push({
    price_data: {
      currency: data.currency,
      product_data: {
        name: "Delivery Charges"
      },
      unit_amount_decimal: Math.round((data.deliveryCharges) * (100)),
    },
    quantity: 1
  });

  console.log(items, data.co2Compensation*100);

  if (data.co2Compensation) {
    items.push({
      price_data: {
        currency: data.currency,
        product_data: {
          name: "CO2 Compensation"
        },
        unit_amount_decimal: Math.round((data.co2Compensation)*100),
      },
      quantity: 1
    })
  }

  const session = await stripe.checkout.sessions.create({
    customer_email: data.email,
    payment_method_types: data.payTypes,
    line_items: items,
    mode: "payment",
    success_url: "https://example.com/success",
    cancel_url: "https://example.com/cancel",
  });



  ctx.response.status = 303;
  ctx.response.body = session.url;

});

router.post("/catch-itents", async ctx => {
  
})


module.exports = router;

