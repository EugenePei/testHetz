import _ from 'lodash'
import userOperate from '../operates/userOperate'

module.exports ={

	getUserInfo: (req,res)=>{
		const _userid = _.trim(req.body.userid)
		console.log(`-------_userid = ${_userid}`)

		userOperate.getUserInfo(_userid,(error,success)=>{
			res.type ='json'

			if(error){
				res.status(202).json({error})
			}else{
				res.status(200).json({success})
			}
		})
	}

}