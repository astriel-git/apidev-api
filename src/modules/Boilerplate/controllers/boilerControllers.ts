// Controller Structure BoilerPlate
// import type { Request, Response, NextFunction } from 'express';
// import * as modelService from '../services/userService.ts';
// import type * as ModelInterface from '../types/userTypes.ts';

// export const controllerFunctionName = async (
//   req: Request<ModelInterface.RegisterRequest>,
//   res: Response<ModelInterface.ApiResponse<ModelInterface.RegisterResponse>>,
//   next: NextFunction
// ): Promise<void> => {
//   try {
//     const result = await modelService.serviceFunctionName(req.body);
//     res.status(201).json({ response: result, status: 'success', message: 'Your Response Message Here!' });
//   } catch (error) {
//     next(error);
//   }
// };