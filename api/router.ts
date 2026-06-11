import { authRouter } from "./routers/auth";
import { categoryRouter } from "./routers/category";
import { productRouter } from "./routers/product";
import { favoriteRouter } from "./routers/favorite";
import { cartRouter } from "./routers/cart";
import { orderRouter } from "./routers/order";
import { addressRouter } from "./routers/address";
import { newsletterRouter } from "./routers/newsletter";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  category: categoryRouter,
  product: productRouter,
  favorite: favoriteRouter,
  cart: cartRouter,
  order: orderRouter,
  address: addressRouter,
  newsletter: newsletterRouter,
});

export type AppRouter = typeof appRouter;
