import { z } from "zod";

export const stickerSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
});
