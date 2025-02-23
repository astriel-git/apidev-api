// src/modules/PacoteB/routes/bRoutes.ts
import * as express from 'express';
import type { Request, Response, NextFunction } from 'express';
import { bPacote } from '../data-access/bService.ts';

interface BPacoteRequestBody {
  cnpjBasico: string;
}

const router = express.Router();

router.post(
  '/bPacote',
  async (req: Request<{}, {}, BPacoteRequestBody>, res: Response): Promise<void> => {
    try {
      const { cnpjBasico } = req.body;
      const razaoSocial = await bPacote.pacoteBservice(cnpjBasico);

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
