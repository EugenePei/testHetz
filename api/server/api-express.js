import fs from 'fs'
// import path from 'path'

import bodyParser from 'body-parser'  // 提供 JSON / Raw / Text / URL-encoded 解析
import morgan from 'morgan'    // HTTP request logger
import fsr from 'file-stream-rotator'  // 每天自动生成一个日志文件
import compression from 'compression'		// Http Request 压缩

import errorhandler from 'errorhandler'	// 错误处理,仅用于Development模式
import session from 'express-session'
import redis from 'connect-redis'
// import favcon from 'serve-favicon'
// // import serveStatic from 'serve-static' // URL地址与服务器地址映射

 import cacheutility from '../src/common/cacheutility'

module.exports = (app,env,config)=>{

	  /**
   * 信任反向代理层,即Nginx,用于 Https 的信任
   */
	app.set('trust proxy', 1)

  /**
   * 用户session存到Redis服务
   */
	const RedisStore = redis(session)
	const sessionConfig ={
		secret: config.secret,
		resave:false,
		saveUninitialized:true,
		cookie:{
			maxAge:config.cookie_maxAge
		}
	}
	if(config.redis){
		sessionConfig.store= new RedisStore({
			client:cacheutility.getRedis()
		})
	}
	app.use(session(sessionConfig))

	 /**
   * Http 请求解析成 json/text/raw/URL-encoded
   */
	app.use(bodyParser.urlencoded({
		extended:true,
		limit:'10mb'
	}))

	app.use(bodyParser.json({
		limit:'10mb'
	}))

 /**
   * 服务器日志
   */

	const logDirectory = `${config.rootPath}/logs`
	 // 确保日志文件存在
	if(!fs.existsSync(logDirectory)) {
		fs.mkdirSync(logDirectory)
	} 

	// 创建一个循环的写入流

	const accessLogStream = fsr.getStream({
		date_format: 'YYYMMDD',
		filename: `${logDirectory}/apiServer-%DATE%.log`,
		frequency:'daily',
		verbose:false
	})
	app.use(morgan('dev',{
		stream: accessLogStream
	}))
 // app.use(favicon(path.resolve(`${config.rootPath}/favicon.ico`)))

  /**
   * Http Request 压缩
   */
	app.use(
		compression({threshhold:512},
		(req,res)=>
		 /json|text|javascript|css/.test(res.getHeader('Content-Type')),
		 {level:9})
		)
	
  /**
   * 用于指定URL路径和服务器路径的映射
   */
  // app.use(express.static(path.resolve(config.rootPath, '/public')))
app.use((req,res,next)=>{
	res.header('Access-Control-Allow-Origin',req.header.origin)
	res.header('Access-Control-Allow-','Accept,Content-Type')
	res.header('Access-Control-Allow-','OPTIONS,GET,POST,PUT,DELETE')
	res.header('Access-Control-Allow-','true')

	if(req.method === 'OPTIONS'){
		res.header('Access-Control-Max-Age',7200)
		res.status(200).end()
		if(req.session){
			req.session.destroy()
		}
		return
	}
	next()
})


  /**
   * 判断运行环境,执行不同动作
   */

	if(env === 'development'){
		app.locals.pretty = true
		app.use(errorhandler({
			dumpException: true,
			showStack: true
		}))
	}
	/*if (env === 'production') {
		
	}*/
}