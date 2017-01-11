import _ from 'lodash'
import Redis from 'ioredis'
import config from '../../../config/config'

const redis = config.redis ? new Redis({
	port: config.redis_port,
	host: config.redis_host,
	password:config.redis_password,
	connectTimeout:400,
	retryStrategy:(times)=>{
		const delay = Math.min(times*2,1000)
		return delay
	},
	reconnectonError:(err)=>{
		console.log('redis-error')
		console.log(err)
		return true
		}	
}) : null


module.exports = {
	initSession(session){
		if(session.cache){
			return true
		}
		session.cache = {}
		return false
	},
	createKey(path,params= {}){
		const array =[]
		params.forEach((key)=>{
			if(params.hasOwnProperty(Key)){
				array.push(`${key} = ${params[key]}`)
			}
		})
		return `${path}?${array.join('&')}`
	},
	getCache(session,key){
		if(this.initSession(session)){
			if(session.cache[key]){
				if(session.cacha[key].time>Date.now()){
					return session.cache[key].content
				}
			}
		}

		_.unset(session.cache,key)
		return undefined
	},
	setCache(session,key,content,timeout=config.cache_default){
		this.initSession(session)
		session.cache[key] = {
			time: Date.now() + timeoout * 1000,
			content
		}
		session.save()
		return true
	},
    unset(session,key){
    	if(this.initSession(session)){
    		_.unset(session.cache,key)
    		session.save()
    		return true
    	}
    	return false
    },
    setSession(sessionID,key,value){
    	if(!config.redis){
    		return false
    	}
    	redis.get(sessionID,(err,results)=>{
    		let data 
    		if(results){
    			const data = JSON.parse(results)
    			if(data.hasOwnProperty(key)){
    				return callback(data[key])
    			}
    		}
    		return callback(false)
    	})
    },

    deleteSession(sessionID,key){
    	redis.get(sessionID,(err,results)=>{
    		if(results){
    			const data =JSON.parse(results)
    			if(data.hasOwnProperty(key)){
    				_.unset(data, key)
    				const text = JSON.stringify(data)
    				redis.set(sessionID,text)
    			}
    		}
    	})
    },

    getRedis(){
    	return redis
    },
    getUser(sessionID,callback){
    	this.getSession(sessionID,config.USER_KEY,(results)=>{
    		if(results){
    			return callback(results)
    		}
    		return callback(false)
    	})
    }

}