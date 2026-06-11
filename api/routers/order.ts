import { z } from "zod";
import { createRouter, authedQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { orders, orderItems, products } from "@db/schema";
import { eq, desc } from "drizzle-orm";
import crypto from "crypto";
import { sendOrderConfirmationEmail } from "../lib/email";

export const orderRouter = createRouter({
  list: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    return db
      .select()
      .from(orders)
      .where(eq(orders.userId, ctx.user.id))
      .orderBy(desc(orders.createdAt));
  }),

  getById: authedQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = getDb();
      const order = await db
        .select()
        .from(orders)
        .where(eq(orders.id, input.id))
        .limit(1);

      if (order.length === 0) return null;
      if (order[0].userId !== ctx.user.id) return null;

      const items = await db
        .select({
          id: orderItems.id,
          productId: orderItems.productId,
          quantity: orderItems.quantity,
          unitPrice: orderItems.unitPrice,
          totalPrice: orderItems.totalPrice,
          productName: products.name,
          productImage: products.image,
        })
        .from(orderItems)
        .innerJoin(products, eq(orderItems.productId, products.id))
        .where(eq(orderItems.orderId, input.id));

      return { ...order[0], items };
    }),

  create: authedQuery
    .input(
      z.object({
        items: z.array(
          z.object({
            productId: z.number(),
            quantity: z.number(),
            unitPrice: z.string(),
            totalPrice: z.string(),
          })
        ),
        shippingAddress: z.object({
          fullName: z.string(),
          phone: z.string(),
          address: z.string(),
          city: z.string(),
          postalCode: z.string(),
        }),
        paymentInfo: z.object({
          cardNumber: z.string(),
          cardHolder: z.string(),
        }),
        totalAmount: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const orderNumber = "ORD-" + crypto.randomBytes(4).toString("hex").toUpperCase();

      const result = await db.insert(orders).values({
        orderNumber,
        userId: ctx.user.id,
        totalAmount: input.totalAmount,
        shippingAddress: input.shippingAddress,
        status: "pending",
        paymentStatus: "paid",
      });

      const orderId = Number(result[0].insertId);

      for (const item of input.items) {
        await db.insert(orderItems).values({
          orderId,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
        });

        // Update stock
        const product = await db.select().from(products).where(eq(products.id, item.productId)).limit(1);
        if (product.length > 0) {
          const newStock = (product[0].stock || 0) - item.quantity;
          await db.update(products).set({ stock: Math.max(0, newStock) }).where(eq(products.id, item.productId));
        }
      }

      // Send confirmation email
      try {
        await sendOrderConfirmationEmail(ctx.user.email, ctx.user.name || "Müşteri", orderNumber, input.totalAmount);
      } catch {
        // Email failed
      }

      return { order: { id: orderId, orderNumber }, success: true };
    }),

  cancel: authedQuery
    .input(z.object({ orderId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const order = await db.select().from(orders).where(eq(orders.id, input.orderId)).limit(1);
      if (order.length === 0) {
        return { success: false, message: "Sipariş bulunamadı" };
      }
      if (order[0].userId !== ctx.user.id) {
        return { success: false, message: "Yetkisiz işlem" };
      }
      if (order[0].status !== "pending") {
        return { success: false, message: "Bu sipariş iptal edilemez" };
      }

      await db.update(orders).set({ status: "cancelled" }).where(eq(orders.id, input.orderId));
      return { success: true };
    }),
});
