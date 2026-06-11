import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { newsletterSubscribers } from "@db/schema";
import { eq } from "drizzle-orm";

export const newsletterRouter = createRouter({
  subscribe: publicQuery
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ input }) => {
      const db = getDb();

      const existing = await db
        .select()
        .from(newsletterSubscribers)
        .where(eq(newsletterSubscribers.email, input.email))
        .limit(1);

      if (existing.length > 0) {
        return { success: true, message: "Zaten abonesiniz" };
      }

      await db.insert(newsletterSubscribers).values({ email: input.email });
      return { success: true, message: "Abonelik başarılı" };
    }),
});
