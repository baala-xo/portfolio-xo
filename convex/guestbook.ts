import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getEntries = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("guestbook_entries")
      .order("desc")
      .take(20);
  },
});

export const addEntry = mutation({
  args: {
    author_name: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const entryId = await ctx.db.insert("guestbook_entries", {
      author_name: args.author_name,
      message: args.message,
      likes: 0,
    });
    return entryId;
  },
});

export const likeEntry = mutation({
  args: { id: v.id("guestbook_entries") },
  handler: async (ctx, args) => {
    const entry = await ctx.db.get(args.id);
    if (!entry) {
      throw new Error("Entry not found");
    }
    
    await ctx.db.patch(args.id, {
      likes: entry.likes + 1,
    });
  },
});

export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const entries = await ctx.db.query("guestbook_entries").collect();
    const totalLikes = entries.reduce((sum, entry) => sum + entry.likes, 0);
    
    return {
      totalEntries: entries.length,
      totalLikes,
    };
  },
});
