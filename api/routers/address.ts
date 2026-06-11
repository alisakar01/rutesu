import { z } from "zod";
import { createRouter, authedQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { addresses } from "@db/schema";
import { eq } from "drizzle-orm";

export const addressRouter = createRouter({
  list: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    return db.select().from(addresses).where(eq(addresses.userId, ctx.user.id));
  }),

  create: authedQuery
    .input(
      z.object({
        title: z.string().min(1),
        fullName: z.string().min(1),
        phone: z.string().min(1),
        address: z.string().min(1),
        city: z.string().min(1),
        postalCode: z.string().min(1),
        isDefault: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();

      if (input.isDefault) {
        await db.update(addresses).set({ isDefault: false }).where(eq(addresses.userId, ctx.user.id));
      }

      const result = await db.insert(addresses).values({
        userId: ctx.user.id,
        ...input,
      });

      const id = Number(result[0].insertId);
      const all = await db.select().from(addresses).where(eq(addresses.id, id));
      return all[0];
    }),

  update: authedQuery
    .input(
      z.object({
        id: z.number(),
        title: z.string().optional(),
        fullName: z.string().optional(),
        phone: z.string().optional(),
        address: z.string().optional(),
        city: z.string().optional(),
        postalCode: z.string().optional(),
        isDefault: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const { id, ...data } = input;

      if (data.isDefault) {
        await db.update(addresses).set({ isDefault: false }).where(eq(addresses.userId, ctx.user.id));
      }

      await db.update(addresses).set(data).where(eq(addresses.id, id));
      const all = await db.select().from(addresses).where(eq(addresses.id, id));
      return all[0];
    }),

  remove: authedQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(addresses).where(eq(addresses.id, input.id));
      return { success: true };
    }),

  setDefault: authedQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      await db.update(addresses).set({ isDefault: false }).where(eq(addresses.userId, ctx.user.id));
      await db.update(addresses).set({ isDefault: true }).where(eq(addresses.id, input.id));
      return { success: true };
    }),
});
