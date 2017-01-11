import sessionUtility from '../src/common/sessionUtility'
module.exports = (app,express,config) =>{
	const router =express.Router()


  /**
   * 每一条路由都要先执行该 middleware(中间件) 一遍
   */
	router.use((req,res,next)=>{
		//next()
		if(!config.auth || req.originalUrl.match('/login')){
			next()
		} else if(req.originalUrl.match('loggout')){
			res.status(200).end()
			if(config.redis){
				sessionUtility.deleteSession(req.sessionID,config.USER_KEY)
			}
		}else if (config.redis){
			cacheUtility.getSession(req.sessionID,config.USER_KEY,(current)=>{
				console.log(`-----------current = ${current}`)
				if(current && current.permission){
					const isLogin =current.permission.some((data)=>{
						return req.originalUrl.match(data)!==null
					})
					if(isLogin){
						if(config.cache&&(req.method ==='GET'|| req.method ==='POST')){
							const key =sessionUtility.createKey(req.originalUrl,req.body)
							const cache= sessionUtility.getCache(req.session, key)
							if(cache){
								res.type='json'
								res.status(200).json({success:cache})
							}
						}
						next()
					}
				}
				res.status(401).json({auth:'用户无法执行该操作'})
			})
		}else if (!config.redis){
			const current =sessionUtility.getCache(req.session,config.USER_KEY)
			if(current&& current.permission){
				const isLogin = current.permission.some((data)=>{
					return req.originalUrl.match(data)!==null
				})
				if(isLogin){
					if(config.cache&&(req.method==='GET'||req.method ==='POST')){
						const key = sessionUtility.createKey(req.originalUrl,req.body)
						const cache = sessionUtility.getCache(req.session,key)
						if(cache){
							res.type ='json'
							res.status(200).json({success:cache})
						}
					}// end of req.method
					next()
				}// end of isLogin
			}// end of if current

			res.status(401).json({auth:'用户没有权限执行该操作'})
		}

	}) // end of route

	router.get('/',(req,res)=>{
		res.send('Hello Moto')
	})


  /**
   * 当找不到匹配路由时进行处理
   */
	router.get('*', (req,res)=>{
		res.json({
			'route': 'Sorry! This page does not exist! 抱歉!该页面不存在!'
		})
	})

	
  /**
   * 给路由加前缀，必须加不然router不生效
   */
	app.use('/',router)
}