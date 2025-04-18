import { z } from 'zod';

export const validateCategorySchema = z.object({
  date: z.string()
});

export const validateDownloadSchema = z.object({
  date: z.string(),
  categories: z.array(z.string())
});

export const validateUnzipSchema = z.object({
  fileName: z.string()
});

export const validateImportSchema = z.object({
  category: z.object({
    value: z.string()
  })
});
