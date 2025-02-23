// src/modules/PacoteD/routes/dRoutes.ts
import * as express from 'express';
import type { Request, Response, NextFunction } from 'express';
import { dPacote } from '../data-access/dService.ts';

interface DPacoteRequestBody {
  cnpjBasico: string;
}

const router = express.Router();

router.post(
  '/dPacote',
  async (req: Request<{}, {}, DPacoteRequestBody>, res: Response): Promise<void> => {
    try {
      const { cnpjBasico } = req.body;
      const razaoSocial = await dPacote.pacoteDservice(cnpjBasico);

      if (razaoSocial) {
        res.status(200).json(razaoSocial);
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
