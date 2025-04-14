import { z } from 'zod';

export const userSaldoSchema = z.object({
  userid: z.string().uuid("Not a Valid User ID"),
});