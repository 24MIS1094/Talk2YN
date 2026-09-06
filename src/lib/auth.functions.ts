import { z } from "zod";

export const signUpSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name").max(80),
  username: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z][a-z0-9_]{2,19}$/, "3-20 chars, start with a letter, only a-z 0-9 _"),
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(8, "Password must be at least 8 characters").max(72),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
