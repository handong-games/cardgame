import express from 'express'
import cors from 'cors'
import skillsRouter from './routes/skills.js'
import docsRouter from './routes/docs.js'
import assetsRouter from './routes/assets.js'

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

// API 라우트
app.use('/api/skills', skillsRouter)
app.use('/api/docs', docsRouter)
app.use('/api/assets', assetsRouter)

app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다`)
})
