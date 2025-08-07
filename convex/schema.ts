import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  guestbook_entries: defineTable({
    author_name: v.string(),
    message: v.string(),
    likes: v.number(),
  }), // Removed the .index() definition here
});
