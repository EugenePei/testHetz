import User from '../models/userModel'
import logger from './Logger'
// 创建 User 表
User.sync({force:true}).then(()=>{
	logger.info(`------创建User表成功------`)
}).catch((err)=>{
	logger.error(`------User表创建失败 = ${err} -------`)
})