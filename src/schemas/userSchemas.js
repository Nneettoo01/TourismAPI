import z from "zod";

export const registerUserSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z
    .string()
    .length(11, "O telefone deve conter exatamente 11 dígitos")
    .regex(/^\d+$/, "O telefone deve conter apenas números"),
  password: z
    .string()
    .min(6, "A senha deve ter pelo menos 6 caracteres")
    .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula"),
});
