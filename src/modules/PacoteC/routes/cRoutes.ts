import * as express from 'express';
import type { Request, Response, NextFunction } from 'express';

import { cPacote } from '../data-access/cService.ts';

interface CPacoteRequestBody {
  cnpjBasico: string;
}

const router = express.Router();

router.post(
  '/cPacote',
  async (req: Request<{}, {}, CPacoteRequestBody>, res: Response): Promise<void> => {
    try {
      const { cnpjBasico } = req.body;
      const razaoSocial = await cPacote.pacoteCservice(cnpjBasico);

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
