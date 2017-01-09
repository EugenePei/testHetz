import fs from 'fs'
import path from 'path'

import bodyParser from 'body-parser'
import morgan from 'morgan'
import fsr from 'file-stream-rotator'
import compression from 'compression'
import serveStatic from 'serve-static'
import errorhandler from 'errorhandler'

import config from '../../config/config'
module.exports = (app,env,config)=>{
	app.set('trust proxy', 1)
	app.use(bodyParser.urlencoded({
		extended:true,
		limit:'10mb'
	}))

	app.use(bodyParser.json({
		limit:'10mb'
	}))



	const logDirectory = config.rootPath + '/logs'
	fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)

	var accessLogStream = fsr.getStream({
		date_format: 'YYYMMDD',
		filename: `${logDirectory}/server-%DATE%.log`,
		frequency:'daily',
		verbose:false
	})
	app.use(morgan('combined',{
		stream: accessLogStream
	}))

	app.use(compression({
		threshhold:512
	},(req,res)=>{
		return /json|text|javascript|css/.test(res.getHeader('Content-Type'))
	}, {
		level:9
	}))
	

	if(env === 'development'){
		app.locals.pretty = true
		app.use(errorhandler({
			dumpException: true,
			showStack: true
		}))
	}
	if (env === 'production') {
		
	}
}