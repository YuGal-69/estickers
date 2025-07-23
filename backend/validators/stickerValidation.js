import { z } from "zod";

export const stickerSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().nullable().optional(),
  price: z.number({
    required_error: "Price is required",
    invalid_type_error: "Price must be a number",
  }).positive("Price must be a positive number"),
});
