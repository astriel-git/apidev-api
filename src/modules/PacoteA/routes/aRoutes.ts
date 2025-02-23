// src/modules/PacoteA/routes/aRoutes.ts
import * as express from 'express';
import type { Request, Response, NextFunction } from 'express';
import { aPacote } from '../data-access/aRepo.ts';

interface APacoteRequestBody {
  cnpjBasico: string;
}

const router = express.Router();

router.post(
  '/aPacote',
  async (req: Request<{}, {}, APacoteRequestBody>, res: Response): Promise<void> => {
    try {
      const { cnpjBasico } = req.body;
      const razaoSocial = await aPacote.pacoteAservice(cnpjBasico);
      if (razaoSocial) {
        res.status(200).json({ razaoSocial });
      } else {
        res.status(404).json({ message: 'Company not found' });
      }
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  }
);

export default router;
