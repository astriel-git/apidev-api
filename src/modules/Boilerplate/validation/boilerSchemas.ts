// import { z } from 'zod';

// export const registerUserSchema = z.object({
//   nome: z.string().min(1, 'Nome muito curto'),
//   email: z.string().email('Email inválido'),
//   senha: z.string().min(1, 'A senha deve ter pelo menos 8 caracteres'),
//   cpf: z.string().regex(/^\d{11}$/, 'CPF inválido'),
//   datanascimento: z.coerce.date()
// });