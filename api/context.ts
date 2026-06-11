import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import type { User } from "@db/schema";
import { verifyToken } from "./lib/jwt";
import { getDb } from "./queries/connection";
import { users } from "@db/schema";
import { eq } from "drizzle-orm";

export type TrpcContext = {
  req: Request;
  resHeaders: Headers;
  user?: User;
};

export async function createContext(
  opts: FetchCreateContextFnOptions,
): Promise<TrpcContext> {
  const ctx: TrpcContext = { req: opts.req, resHeaders: opts.resHeaders };

  try {
    const authHeader = opts.req.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.slice(7);
      const payload = verifyToken(token);
      if (payload && payload.userId) {
        const db = getDb();
        const user = await db.select().from(users).where(eq(users.id, payload.userId)).limit(1);
        if (user.length > 0) {
          ctx.user = user[0];
        }
      }
    }
  } catch {
    // Authentication is optional
  }

  return ctx;
}
