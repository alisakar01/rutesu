import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { products, categories } from "@db/schema";
import { eq, and, gte, lte, desc, asc, like } from "drizzle-orm";

export const productRouter = createRouter({
  list: publicQuery
    .input(
      z.object({
        categorySlug: z.string().optional(),
        minPrice: z.number().optional(),
        maxPrice: z.number().optional(),
        sort: z.enum(["newest", "price_asc", "price_desc", "name"]).optional(),
        page: z.number().default(1),
        limit: z.number().default(12),
        featured: z.boolean().optional(),
        isNew: z.boolean().optional(),
        search: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const db = getDb();
      const page = input.page || 1;
      const limit = input.limit || 12;
      const offset = (page - 1) * limit;

      let query = db.select().from(products);
      const conditions = [];

      if (input.categorySlug) {
        const cat = await db.select().from(categories).where(eq(categories.slug, input.categorySlug)).limit(1);
        if (cat.length > 0) {
          conditions.push(eq(products.categoryId, cat[0].id));
        }
      }

      if (input.minPrice !== undefined) {
        conditions.push(gte(products.price, input.minPrice.toString()));
      }
      if (input.maxPrice !== undefined) {
        conditions.push(lte(products.price, input.maxPrice.toString()));
      }
      if (input.featured) {
        conditions.push(eq(products.featured, true));
      }
      if (input.isNew) {
        conditions.push(eq(products.isNew, true));
      }
      if (input.search) {
        conditions.push(like(products.name, `%${input.search}%`));
      }

      let finalQuery;
      if (conditions.length > 0) {
        finalQuery = query.where(and(...conditions));
      } else {
        finalQuery = query;
      }

      if (input.sort === "price_asc") {
        finalQuery = finalQuery.orderBy(asc(products.price));
      } else if (input.sort === "price_desc") {
        finalQuery = finalQuery.orderBy(desc(products.price));
      } else if (input.sort === "name") {
        finalQuery = finalQuery.orderBy(asc(products.name));
      } else {
        finalQuery = finalQuery.orderBy(desc(products.createdAt));
      }

      const allResults = await finalQuery;
      const total = allResults.length;
      const paginatedResults = allResults.slice(offset, offset + limit);

      return {
        products: paginatedResults,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      };
    }),

  getBySlug: publicQuery
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db.select().from(products).where(eq(products.slug, input.slug)).limit(1);
      return result[0] || null;
    }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db.select().from(products).where(eq(products.id, input.id)).limit(1);
      return result[0] || null;
    }),

  getFeatured: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(products).where(eq(products.featured, true)).orderBy(desc(products.createdAt)).limit(8);
  }),

  getNew: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(products).where(eq(products.isNew, true)).orderBy(desc(products.createdAt)).limit(4);
  }),

  getRelated: publicQuery
    .input(z.object({ productId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const product = await db.select().from(products).where(eq(products.id, input.productId)).limit(1);
      if (product.length === 0) return [];

      return db
        .select()
        .from(products)
        .where(eq(products.categoryId, product[0].categoryId))
        .limit(5);
    }),
});
