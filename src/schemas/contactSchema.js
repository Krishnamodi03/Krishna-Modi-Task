import * as z from "zod";

export const contactSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.email("Invalid email address"),
  phoneNumber: z.string().regex(/^\d{10}$/, "Phone must be 10 digits"),
  message: z.string().max(250, "Message must be at most 250 characters").optional().or(z.literal("")),
}); 