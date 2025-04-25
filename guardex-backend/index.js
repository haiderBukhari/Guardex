import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.js'
import scanRoutes from './routes/scannedApplication.js'
import { config } from 'dotenv'

config();
const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
// app.use(cors({
//   origin: process.env.FRONTEND_URL,
//   credentials: true
// }))

app.use(express.json())

app.get('/', (req, res) => {
  res.send('🚀 API is running...')
})

app.use('/api/auth', authRoutes)
app.use('/api/scan', scanRoutes)

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`)
})