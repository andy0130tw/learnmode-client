//Cookie cache.
//Once the cookie is read,
// its form of object will be cached and be updated when saving it back.
var cookie=null;
var useLocalStorage=false;

function isLocalStorageSupported(){
	return localStorage!==null&&localStorage!==undefined;
}

var storageObject={
	init:function(){
		assert(!cookie,"storageObject.init","cookie is not null.");
		cookie={};
		if(isLocalStorageSupported()){
			useLocalStorage=true;
			//migration
			var macMigration=$.cookie("mac");
			if(macMigration){
				storageObject.save("mac",macMigration);
				$.removeCookie("mac");
			}
		}else{
			var raw=$.cookie();
			for(var x in raw)storageObject.load(x);
		}
	},
	flush:function(key,option){
		if(useLocalStorage){

		}else{
			if(key)return storageObject.save(key,cookie[key],option);
			for(var x in cookie)storageObject.save(x,cookie[x],option);
		}
	},
	save:function(key,obj,option){
		if(useLocalStorage){
			return localStorage.setItem(key,obj);
		}else{
			cookie[key]=obj;
			if(obj instanceof Object)val=JSON.stringify(obj);
			else val=obj;
			return $.cookie(key,val,option);
		}
		
	},
	load:function(key){
		if(useLocalStorage){
			return localStorage.getItem(key);
		}else{
			if(cookie[key])return cookie[key];
			var val=$.cookie(key);
			try{
				return cookie[key]=JSON.parse(val);
			}catch(e){
				return cookie[key]=val;
			}
		}
	},
	remove:function(key){
		if(useLocalStorage){
			return localStorage.removeItem(key);
		}else{
			return $.removeCookie(key);
		}
	},
	clear:function(){
		if(useLocalStorage){
			return localStorage.clear();
		}else{
			for(var x in cookie)$.removeCookie(x);
		}
	}
}