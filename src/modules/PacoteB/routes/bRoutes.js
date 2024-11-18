import { bPacote } from '../../PacoteB/data-access/bService.js'
import { Router } from 'express'

const router = Router()

router.post('/bPacote', async (req, res) => {
  try {
    const { cnpjBasico } = req.body
    const razaoSocial = await bPacote.pacoteBservice(cnpjBasico)

    if (razaoSocial) {
      res.status(200).json({ razaoSocial })
    } else {
      res.status(404).json({ message: 'Company not found' })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: error.message })
  }
})

export default router
