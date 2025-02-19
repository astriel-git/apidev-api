// app.js
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import whitelist from './config/whitelist.js'
import routes from './routes/index.js'
import errorHandler from './errors/errorHandler.js'
import { errorMiddleware } from './core/errors/errorMiddleware.js' // Ensure this path is correct

import './core/extensions/bigintExtension.js'

export const app = express()

app.use(express.urlencoded({ limit: '25mb', extended: true }))
app.use(express.json({ limit: '25mb', extended: true }))

const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

app.use(cors(corsOptions))
app.use(helmet())

app.use('/', routes)

// Global error handling for non-Express errors
process.on('uncaughtException', (error) => {
  errorHandler.handleError(error)
})

process.on('unhandledRejection', (reason) => {
  errorHandler.handleError(reason)
})

// Express error-handling middleware (should be last)
app.use(errorMiddleware)

export default app
