'use strict'
import path from 'path'
export default {
	name: 'HertzScaffold',

	apiport: 8086,
	redis: true,
	rootPath: path.resolve(__dirname,'../'),
  	secret: 'HertzScaffold',
//数据库参数
	db_type: 'mysql',
	db_host: 'localhost',
	db_username:'root',
	db_password: 'Y4yhl9t!', 

	db_database: 'dev',
	db_post:3306,
	db_charset: 'utf8mb4',
	db_maxConnection:50,
	db_maxIdleTime:30,
//redis 缓存参数
	redis_host:'127.0.0.1',
	redis_port:3603,
	redis_password:'123456',
	cookie_maxAge: 7*24*60*60*1000,
	cache_default:60
}