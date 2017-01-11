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

require('./server/api-routes')(app, express, config)


// 127.0.0.1限制本机访问，用于生产环境仅允许域名访问nginx跳转
// 要注意用手机调试时去掉
http.createServer(app).listen(apiport,'127.0.0.1',(err)=>{
  console.info(`==> 🌐  ${config.name} Server started on port ${apiport}, env=${env}`)
})
