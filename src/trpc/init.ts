import { db } from "@/db";
import { initTRPC, TRPCError } from "@trpc/server";
import { cache } from "react";
import { eq } from "drizzle-orm";

export const createTRPCContext = cache(async () => {  
  return { };
});

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;

const t = initTRPC.context<Context>().create();

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;