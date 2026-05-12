import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getSignatures = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("signatures").order("desc").take(60);
  },
});

export const addSignature = mutation({
  args: {
    signature: v.string(),
    author_name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("signatures", {
      signature: args.signature,
      author_name: args.author_name?.trim() || undefined,
    });
  },
});
