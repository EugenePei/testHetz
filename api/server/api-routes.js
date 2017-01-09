module.exports = (app,express) =>{
	const router =express.Router()

	router.use((req,res,next)=>{
		next()
	})

	router.get('/',function(req,res){
		res.send('Hello Moto')
	})

	router.get('*', (req,res)=>{
		res.json({
			'route': 'Sorry! This page does not exist! 抱歉!该页面不存在!'
		})
	})
	app.use('/',router)
}