import { z } from 'zod';

export const registerUserSchema = z.object({
  nome: z.string().min(1, 'Nome muito curto'),
  email: z.string().email('Email inválido'),
  senha: z.string().min(1, 'A senha deve ter pelo menos 8 caracteres'),
  cpf: z.string().regex(/^\d{11}$/, 'CPF inválido'),
  datanascimento: z.coerce.date()
});

export const loginSchema = z.object({
  identificador: z.string(),
  senha: z.string()
  // senha: z.string().min(8, 'A senha deve ter pelo menos 8 caracteres')
});

export const recoverPasswordSchema = z.object({
  email: z.string().email('Email inválido'),
  cpf: z.string().regex(/^\d{11}$/, 'CPF inválido')
});

export const resetPasswordSchema = z.object({
  token: z.string(),
  newPassword: z.string().min(1, 'A senha deve ter pelo menos 8 caracteres')
});

export const validateResetSchema = z.object({
  token: z.string()
});