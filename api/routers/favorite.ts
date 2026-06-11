import { z } from "zod";
import { createRouter, authedQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { favorites, products } from "@db/schema";
import { eq, and } from "drizzle-orm";

export const favoriteRouter = createRouter({
  list: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    const result = await db
      .select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        description: products.description,
        price: products.price,
        salePrice: products.salePrice,
        image: products.image,
        categoryId: products.categoryId,
        stock: products.stock,
        featured: products.featured,
        isNew: products.isNew,
        createdAt: products.createdAt,
      })
      .from(favorites)
      .innerJoin(products, eq(favorites.productId, products.id))
      .where(eq(favorites.userId, ctx.user.id));
    return result;
  }),

  add: authedQuery
    .input(z.object({ productId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      await db.insert(favorites).values({
        userId: ctx.user.id,
        productId: input.productId,
      });
      return { success: true };
    }),

  remove: authedQuery
    .input(z.object({ productId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      await db
        .delete(favorites)
        .where(and(eq(favorites.userId, ctx.user.id), eq(favorites.productId, input.productId)));
      return { success: true };
    }),

  isFavorite: authedQuery
    .input(z.object({ productId: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = getDb();
      const result = await db
        .select()
        .from(favorites)
        .where(and(eq(favorites.userId, ctx.user.id), eq(favorites.productId, input.productId)))
        .limit(1);
      return result.length > 0;
    }),

  toggle: authedQuery
    .input(z.object({ productId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const existing = await db
        .select()
        .from(favorites)
        .where(and(eq(favorites.userId, ctx.user.id), eq(favorites.productId, input.productId)))
        .limit(1);

      if (existing.length > 0) {
        await db
          .delete(favorites)
          .where(and(eq(favorites.userId, ctx.user.id), eq(favorites.productId, input.productId)));
        return { isFavorite: false };
      } else {
        await db.insert(favorites).values({
          userId: ctx.user.id,
          productId: input.productId,
        });
        return { isFavorite: true };
      }
    }),
});
