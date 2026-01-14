import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { createRedis } from './services/cache'
import { makeResponseV1 } from './handlers/v1'
import { makeResponseV2 } from './handlers/v2'

const app = new Hono<{ Bindings: Env }>()

app.use('*', cors())

app.get('/', (c) => {
  return c.redirect('https://github.com/jw-12138/should-i-work-today', 301)
})

// v1 接口
app.get('/api/v1', async (c) => {
  const redis = createRedis(c.env)
  const res = await makeResponseV1(redis)
  return c.json(res)
})

app.get('/api/v1/tomorrow', async (c) => {
  const redis = createRedis(c.env)
  const res = await makeResponseV1(redis, 'tomorrow')
  return c.json(res)
})

// v2 接口
app.get('/api/v2', async (c) => {
  const redis = createRedis(c.env)
  const res = await makeResponseV2(redis)
  return c.json(res)
})

app.get('/api/v2/tomorrow', async (c) => {
  const redis = createRedis(c.env)
  const res = await makeResponseV2(redis, 'tomorrow')
  return c.json(res)
})

export default app
