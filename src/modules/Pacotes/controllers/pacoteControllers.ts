// Controller Structure BoilerPlate
import type { Request, Response, NextFunction } from 'express';
import * as pacoteService from '../services/pacoteService.ts';
import type * as PacoteInterface from '../types/pacoteTypes.ts';

export const listPacotes = async (
  req: Request,
  res: Response<PacoteInterface.ApiResponse<PacoteInterface.ListResponse[]>>,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await pacoteService.listPacotes();
    res.status(201).json({ response: result, status: 'success', message: 'Your Response Message Here!' });
  } catch (error) {
    next(error);
  }
};

