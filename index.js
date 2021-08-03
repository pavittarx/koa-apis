const app = new (require("koa"))();
const stripe = require('stripe')(process.env.STRIPE_API_KEY);

const koaBody = require('koa-body');

app.use(koaBody());

const payRouter = require("./routes/payments");

app.use(payRouter.routes())
   .use(payRouter.allowedMethods());

app.use(ctx => ctx.body="HW");

app.listen(3000);