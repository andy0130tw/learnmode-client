//Cookie cache.
//Once the cookie is read,
// its form of object will be cached and be updated when saving it back.
var cookie=null;

var cookieObject={
	init:function(){
		assert(!cookie,"cookieObject.init","cookie is not null.");
		cookie={};
		var raw=$.cookie();
		for(var x in raw)cookieObject.load(x);
	},
	flush:function(key,option){
		if(key)return cookieObject.save(key,cookie[key],option);
		for(var x in cookie)cookieObject.save(x,cookie[x],option);
	},
	save:function(key,obj,option){
		cookie[key]=obj;
		if(obj instanceof Object)val=JSON.stringify(obj);
		else val=obj;
		return $.cookie(key,val,option);
	},
	load:function(key){
		if(cookie[key])return cookie[key];
		var val=$.cookie(key);
		try{
			return cookie[key]=JSON.parse(val);
		}catch(e){
			return cookie[key]=val;
		}
	}
}