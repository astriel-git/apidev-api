import type { Request, Response, NextFunction } from 'express';
import * as saldoService from '../services/saldoService.ts';
import type * as SaldoInterface from '../types/saldoTypes.ts';

export const userSaldos = async (
  req: Request<SaldoInterface.UserSaldoRequest>,
  res: Response<SaldoInterface.ApiResponse<SaldoInterface.UserSaldoResponse[]>>,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await saldoService.findSaldos(req.body);
    res.status(201).json({ response: result, status: 'success', message: 'Your Response Message Here!' });
  } catch (error) {
    next(error);
  }
};