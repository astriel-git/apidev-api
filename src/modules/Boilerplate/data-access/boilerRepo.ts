// src/modules/Users/data-access/userRepo.ts
// import prisma from '../../../config/prismaClient.ts';
// import { PrismaClientError, UnauthorizedError, TokenExpiredError } from '../../../core/errors/customErrors.ts';
// import { Prisma } from '@prisma/client';
// import type * as BoilerInterface from '../types/boilerTypes.ts';

// export const boiler = {

//   async register(dados: BoilerInterface.RegisterRequest): Promise<BoilerInterface.RegisterResponse> {
//     try {
//       const newBoiler = await prisma.boiler.create({
//         data: {
//           nome: dados.nome,
//           email: dados.email,
//           cpf: dados.cpf,
//           cnpj: dados?.cnpj,
//           senha: dados.senha,
//           datanascimento: dados.datanascimento,
//           razaosocial: dados?.razaosocial,
          
//         },
//       });
//       const registeredUser: BoilerInterface.RegisterResponse = {
//         iduser: newBoiler.iduser,
//         role: newBoiler.role,
//         nome: newBoiler.nome,
//         email: newBoiler.email,
//         cpf: newBoiler.cpf,
//       };
//       return registeredUser;
//     } catch (error: unknown) {
//       if (error instanceof Prisma.PrismaClientKnownRequestError) {
//         throw new PrismaClientError(error);
//       }
//       throw error;
//     }
//   }
// };
