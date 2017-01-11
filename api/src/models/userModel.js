import sequelize  from 'sequelize'
import DBconn from '../common/DBconn'

const conn = DBconn.getConn()

const User = conn.define('sys_user', {
	userid:   { type:  sequelize.INTEGER, autoIncrement: true, primaryKey: true , unique: true},
	loginname:  {type: sequelize.STRING, allowNull:false, comment: '登录名' },
	displayname: {type: sequelize.STRING, allowNull:false, comment: '昵称' },
	password:   {type: sequelize.STRING, defaultValue:null, comment: '密码' },
	telphone:  {type:  sequelize.STRING, defaultValue:null, comment: '电话' },
	avatar:     {type: sequelize.STRING, defaultValue:null, comment: '个人头像url'},
	gender:     {type: sequelize.ENUM,  values: ['0','1'], defaultValue:'1', comment: '0.女 1.男'},
	remarks:    {type: sequelize.STRING,defaultValue:null, comment: '备注' },
	status:     {type: sequelize.ENUM,  values: ['0','1'], defaultValue:'1', comemnt: '账号状态：0.锁定 1.正常'},
//	groupid:    {type: sequelize.INTEGER, defaultValue:null, comment: '分组id'},
}, {
	paranoid:true // 这个参数会加上 deleteAt 字段
})
module.exports =User