import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getTodos = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("todos")
      .order("asc")
      .collect();
  },
});

export const addTodo = mutation({
  args: { text: v.string() },
  handler: async (ctx, args) => {
    const todos = await ctx.db.query("todos").collect();
    return await ctx.db.insert("todos", {
      text: args.text,
      completed: false,
      createdAt: Date.now(),
      order: todos.length,
    });
  },
});

export const toggleTodo = mutation({
  args: { id: v.id("todos") },
  handler: async (ctx, args) => {
    const todo = await ctx.db.get(args.id);
    if (!todo) throw new Error("Todo not found");
    return await ctx.db.patch(args.id, {
      completed: !todo.completed,
    });
  },
});

export const deleteTodo = mutation({
  args: { id: v.id("todos") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});

export const clearCompleted = mutation({
  args: {},
  handler: async (ctx) => {
    const completed = await ctx.db
      .query("todos")
      .filter((q) => q.eq(q.field("completed"), true))
      .collect();
    
    for (const todo of completed) {
      await ctx.db.delete(todo._id);
    }
    return completed.length;
  }
});