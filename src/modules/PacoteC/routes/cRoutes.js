import { cPacote } from '../../PacoteC/data-access/cService.js'
import { Router } from 'express'

const router = Router()

router.post('/cPacote', async (req, res) => {
  try {
    const { cnpjBasico } = req.body
    const razaoSocial = await cPacote.pacoteCservice(cnpjBasico)

    if (razaoSocial) {
      res.status(200).json(razaoSocial)
    } else {
      res.status(404).json({ message: 'Company not found' })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: error.message })
  }
})

export default router
