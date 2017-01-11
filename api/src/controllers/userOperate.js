import DBconn from '../common/DBconn'
import logger from '../common/Logger'
import User from '../models/userModel'

const conn = DBconn.getconn()

module.exports ={
/*
*获取用户信息
*/	
	getUserInfo: (userid,callback)=>{
		User.findOne({
			where:{
				userid
			},
			attributes:['userid','displayname','loginname']
		}).then((user)=>{
			return callback(null,user)
		}).catch((error)=>{
			logger.error(`-------userOperate getUserInfo error = ${error}--------`)
			return callbalk(error)
		})
	},
} // end of mudule.exports