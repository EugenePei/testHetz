import sequelize from 'sequelize'
import config from '../../../config/config'

/**
 * 构造数据库连接
 */
const conn = new sequelize(config.db_database,config.db_username,config.db_password,{
	host: config.db_host,
	port: config.db_port,
	dialect: config.db_type,
	pool:{
		maxConnections: config.db_maxConnection,
		maxIdleTime: config.db_maxIdleTime
	}
})
/**
 * 获取数据库接口
 */
exports.getConn = ()=> conn
