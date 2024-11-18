// src/apps/LibRoutes/entry-points/api/index.js
import { Router } from 'express'
import downloaderRoutes from './downloaderRoutes.js'
import importerRoutes from './importerRoutes.js'
import unzipperRoutes from './unzipperRoutes.js'
import getAvailableDates from './getAvailableDates.js'
import getAvailableCategories from './getAvailableCategories.js'

const router = Router()

router.use('/download', downloaderRoutes)
router.use('/import', importerRoutes)
router.use('/unzip', unzipperRoutes)
router.use('/dates', getAvailableDates)
router.use('/categories', getAvailableCategories)

export default router
