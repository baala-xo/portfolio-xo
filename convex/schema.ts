import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  guestbook_entries: defineTable({
    author_name: v.string(),
    message: v.string(),
    likes: v.number(),
  }),
  signatures: defineTable({
    signature: v.string(),
    author_name: v.optional(v.string()),
  }),
});
