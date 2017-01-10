module.exports = (app,express) =>{
	const router =express.Router()


  /**
   * 每一条路由都要先执行该 middleware(中间件) 一遍
   */
	router.use((req,res,next)=>{
		next()
	})

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