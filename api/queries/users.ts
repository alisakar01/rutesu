import { eq } from "drizzle-orm";
import * as schema from "@db/schema";
import type { InsertUser } from "@db/schema";
import { getDb } from "./connection";
import { env } from "../lib/env";

export async function findUserByEmail(email: string) {
  const rows = await getDb()
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, email))
    .limit(1);
  return rows.at(0);
}

// Backward compat for kimi auth - searches by email field
export async function findUserByUnionId(unionId: string) {
  const rows = await getDb()
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, unionId))
    .limit(1);
  return rows.at(0);
}

export async function createUser(data: InsertUser) {
  const result = await getDb().insert(schema.users).values(data);
  return result;
}

export async function updateUser(id: number, data: Partial<InsertUser>) {
  await getDb()
    .update(schema.users)
    .set(data)
    .where(eq(schema.users.id, id));
}

// Backward compat for kimi auth
export async function upsertUser(data: Partial<InsertUser> & { unionId?: string }) {
  const { unionId, ...userData } = data;
  const email = unionId || userData.email;
  if (!email) return;

  const existing = await findUserByEmail(email);
  if (existing) {
    await getDb()
      .update(schema.users)
      .set({ ...userData, email, updatedAt: new Date() })
      .where(eq(schema.users.id, existing.id));
  } else {
    await getDb().insert(schema.users).values({
      name: userData.name || "User",
      email,
      password: "",
      emailVerified: true,
      ...userData,
    } as InsertUser);
  }
}
