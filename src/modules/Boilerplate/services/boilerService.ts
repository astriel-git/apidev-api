// import { user } from '../data-access/boilerRepo.ts';
// import { UnauthorizedError, BadRequestError, ConstraintError, PrismaClientError } from '../../../core/errors/customErrors.ts';
// import type * as BoilerInterface from '../types/boilerTypes.ts';

// export const registerBoiler = async (dados: BoilerInterface.RegisterRequest): Promise<BoilerInterface.RegisterResponse> => {
//   if (!dados.nome || !dados.email || !dados.senha) {
//     throw new BadRequestError('Name, email, and senha are required.');
//   }

//   try {
//     const newUser = await user.register(dados);
//     if (!newUser) {
//       throw new Error('User could not be registered.');
//     }
//     return newUser;
//   } catch (error: unknown) {
//     if (error instanceof PrismaClientError) {
//         throw new ConstraintError('User already exists.'); 
//       }
//     }
//     throw Error;
// };

