import { z } from "zod";
import { createRouter, authedQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { cartItems, products } from "@db/schema";
import { eq, and } from "drizzle-orm";

export const cartRouter = createRouter({
  list: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    const result = await db
      .select({
        id: cartItems.id,
        userId: cartItems.userId,
        productId: cartItems.productId,
        quantity: cartItems.quantity,
        createdAt: cartItems.createdAt,
        product: {
          id: products.id,
          name: products.name,
          slug: products.slug,
          price: products.price,
          salePrice: products.salePrice,
          image: products.image,
          stock: products.stock,
        },
      })
      .from(cartItems)
      .innerJoin(products, eq(cartItems.productId, products.id))
      .where(eq(cartItems.userId, ctx.user.id));
    return result;
  }),

  add: authedQuery
    .input(z.object({ productId: z.number(), quantity: z.number().default(1) }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const existing = await db
        .select()
        .from(cartItems)
        .where(and(eq(cartItems.userId, ctx.user.id), eq(cartItems.productId, input.productId)))
        .limit(1);

      if (existing.length > 0) {
        await db
          .update(cartItems)
          .set({ quantity: existing[0].quantity + input.quantity })
          .where(eq(cartItems.id, existing[0].id));
      } else {
        await db.insert(cartItems).values({
          userId: ctx.user.id,
          productId: input.productId,
          quantity: input.quantity,
        });
      }
      return { success: true };
    }),

  updateQuantity: authedQuery
    .input(z.object({ productId: z.number(), quantity: z.number().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      await db
        .update(cartItems)
        .set({ quantity: input.quantity })
        .where(and(eq(cartItems.userId, ctx.user.id), eq(cartItems.productId, input.productId)));
      return { success: true };
    }),

  remove: authedQuery
    .input(z.object({ productId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      await db
        .delete(cartItems)
        .where(and(eq(cartItems.userId, ctx.user.id), eq(cartItems.productId, input.productId)));
      return { success: true };
    }),

  clear: authedQuery.mutation(async ({ ctx }) => {
    const db = getDb();
    await db.delete(cartItems).where(eq(cartItems.userId, ctx.user.id));
    return { success: true };
  }),

  getCount: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    const result = await db
      .select({ count: cartItems.quantity })
      .from(cartItems)
      .where(eq(cartItems.userId, ctx.user.id));
    return result.reduce((sum, item) => sum + (item.count || 0), 0);
  }),
});
