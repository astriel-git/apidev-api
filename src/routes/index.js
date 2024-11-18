// routes/index.js

import { Router } from 'express'
import userRoutes from '../modules/Users/routes/userRoutes.js'
import aRoutes from '../modules/PacoteA/routes/aRoutes.js'
import bRoutes from '../modules/PacoteB/routes/bRoutes.js'
import cRoutes from '../modules/PacoteC/routes/cRoutes.js'
import dRoutes from '../modules/PacoteD/routes/dRoutes.js'
import libRoutes from '../modules/Utilities/routes/index.js'

const router = Router()

// Define all routes under a consistent namespace
router.use('/users', userRoutes)
router.use('/pacote-a', aRoutes)
router.use('/pacote-b', bRoutes)
router.use('/pacote-c', cRoutes)
router.use('/pacote-d', dRoutes)
router.use('/library', libRoutes)

export default router
