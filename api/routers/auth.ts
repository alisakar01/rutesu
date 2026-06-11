import { z } from "zod";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { TRPCError } from "@trpc/server";
import { createRouter, publicQuery, authedQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { users } from "@db/schema";
import { eq } from "drizzle-orm";
import { signToken } from "../lib/jwt";
import { sendVerificationEmail, sendPasswordResetEmail } from "../lib/email";

export const authRouter = createRouter({
  register: publicQuery
    .input(
      z.object({
        name: z.string().min(2, "Ad en az 2 karakter olmalı"),
        email: z.string().email("Geçerli bir email adresi girin"),
        password: z.string().min(6, "Şifre en az 6 karakter olmalı"),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();

      const existing = await db.select().from(users).where(eq(users.email, input.email)).limit(1);
      if (existing.length > 0) {
        throw new TRPCError({ code: "CONFLICT", message: "Bu email adresi zaten kayıtlı" });
      }

      const hashedPassword = await bcrypt.hash(input.password, 12);
      const verificationToken = crypto.randomBytes(32).toString("hex");

      const result = await db.insert(users).values({
        name: input.name,
        email: input.email,
        password: hashedPassword,
        verificationToken,
        emailVerified: false,
        role: "user",
      });

      const userId = Number(result[0].insertId);

      try {
        await sendVerificationEmail(input.email, input.name, verificationToken);
      } catch {
        // Email sending failed, but user is created
      }

      const token = signToken({ userId, email: input.email, role: "user" });

      return {
        user: { id: userId, name: input.name, email: input.email, role: "user" },
        token,
      };
    }),

  login: publicQuery
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();

      const user = await db.select().from(users).where(eq(users.email, input.email)).limit(1);
      if (user.length === 0) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Email veya şifre hatalı" });
      }

      const valid = await bcrypt.compare(input.password, user[0].password);
      if (!valid) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Email veya şifre hatalı" });
      }

      const token = signToken({ userId: user[0].id, email: user[0].email, role: user[0].role });

      return {
        user: { id: user[0].id, name: user[0].name, email: user[0].email, role: user[0].role },
        token,
      };
    }),

  me: publicQuery.query(async ({ ctx }) => {
    if (!ctx.user) return null;
    return {
      id: ctx.user.id,
      name: ctx.user.name,
      email: ctx.user.email,
      role: ctx.user.role,
      emailVerified: ctx.user.emailVerified,
    };
  }),

  verifyEmail: publicQuery
    .input(z.object({ token: z.string() }))
    .mutation(async ({ input }) => {
      const db = getDb();

      const user = await db.select().from(users).where(eq(users.verificationToken, input.token)).limit(1);
      if (user.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Geçersiz veya süresi dolmuş token" });
      }

      await db.update(users).set({
        emailVerified: true,
        verificationToken: null,
      }).where(eq(users.id, user[0].id));

      return { success: true };
    }),

  forgotPassword: publicQuery
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ input }) => {
      const db = getDb();

      const user = await db.select().from(users).where(eq(users.email, input.email)).limit(1);
      if (user.length === 0) {
        return { success: true }; // Don't reveal if email exists
      }

      const resetToken = crypto.randomBytes(32).toString("hex");
      const resetTokenExpires = new Date(Date.now() + 3600000); // 1 hour

      await db.update(users).set({
        resetToken,
        resetTokenExpires,
      }).where(eq(users.id, user[0].id));

      try {
        await sendPasswordResetEmail(input.email, user[0].name || "Kullanıcı", resetToken);
      } catch {
        // Email sending failed
      }

      return { success: true };
    }),

  resetPassword: publicQuery
    .input(
      z.object({
        token: z.string(),
        password: z.string().min(6),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();

      const user = await db.select().from(users).where(eq(users.resetToken, input.token)).limit(1);
      if (user.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Geçersiz token" });
      }

      if (user[0].resetTokenExpires && new Date(user[0].resetTokenExpires) < new Date()) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Token süresi dolmuş" });
      }

      const hashedPassword = await bcrypt.hash(input.password, 12);

      await db.update(users).set({
        password: hashedPassword,
        resetToken: null,
        resetTokenExpires: null,
      }).where(eq(users.id, user[0].id));

      return { success: true };
    }),

  resendVerification: publicQuery
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ input }) => {
      const db = getDb();

      const user = await db.select().from(users).where(eq(users.email, input.email)).limit(1);
      if (user.length === 0) {
        return { success: true };
      }

      if (user[0].emailVerified) {
        return { success: true };
      }

      const verificationToken = crypto.randomBytes(32).toString("hex");
      await db.update(users).set({ verificationToken }).where(eq(users.id, user[0].id));

      try {
        await sendVerificationEmail(input.email, user[0].name || "Kullanıcı", verificationToken);
      } catch {
        // Email sending failed
      }

      return { success: true };
    }),

  updateProfile: authedQuery
    .input(
      z.object({
        name: z.string().min(2).optional(),
        phone: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();

      await db.update(users).set({
        name: input.name || ctx.user.name,
      }).where(eq(users.id, ctx.user.id));

      const updated = await db.select().from(users).where(eq(users.id, ctx.user.id)).limit(1);
      return { user: updated[0] };
    }),

  changePassword: authedQuery
    .input(
      z.object({
        currentPassword: z.string(),
        newPassword: z.string().min(6),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();

      const user = await db.select().from(users).where(eq(users.id, ctx.user.id)).limit(1);
      if (user.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Kullanıcı bulunamadı" });
      }

      const valid = await bcrypt.compare(input.currentPassword, user[0].password);
      if (!valid) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Mevcut şifre hatalı" });
      }

      const hashedPassword = await bcrypt.hash(input.newPassword, 12);
      await db.update(users).set({ password: hashedPassword }).where(eq(users.id, ctx.user.id));

      return { success: true };
    }),
});
