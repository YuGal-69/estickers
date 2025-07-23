import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10).max(15),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  role: z.enum(["user", "admin"]).optional().default("user"),
});

export const loginSchema = z.object({
  email: z.string().email(),
});
