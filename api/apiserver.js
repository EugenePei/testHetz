import http from 'http'
import express from 'express'

import config from '../config/config'

/*创建服务器*/

const app = module.exports = express()

const env = process.env.NODE_ENV || 'development'
const apiport = process.env.PORT || config.apiport || 3000

app.set('env',env)
app.set('port',apiport)

require('./server/api-express')(app, env, config)

require('./server/api-routes')(app, express)

http.createServer(app).listen(apiport,'127.0.0.1',(err)=>{
  console.info(`==> 🌐  ${config.name} Server started on port ${apiport}, env=${env}`)
})
