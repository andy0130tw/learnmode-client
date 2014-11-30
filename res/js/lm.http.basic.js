var expriUseCache=false;
var expriUseLowLevelQuery=false;

/*var CachePool=function(){};
CachePool.getId=function(obj){
	return obj["id"];
};
CachePool.prototype.length=0;
//if
CachePool.prototype.nullCount=0;
CachePool.prototype.pool={};
CachePool.prototype.poolArray=[];
//diff from `set` in Backbone.js
CachePool.prototype.save=function(obj){
	//must save raw obj
	if(!getId(obj)){
		throw new Error("NO ID given");
		return;
	}
	if(getId(obj)=="")
	var prevObj=this.pool[getId(obj)];
	this.pool[getId(obj)]=obj;
	if(prevObj==null){
		this.length++;
		this.poolArray.push(obj);
	}
	if(prevObj===null)
		this.nullCount--;

	return this;
};

CachePool.prototype.indexOf=function(objOrId){
	if(typeof objOrId==="string"){
		for(var i=0,c=poolArray.length;i<c;i++){
			var obj;
			if(obj=poolArray[i]&&getId(obj)==objOrId)
				return i;
		}
		return -1;
	}else{
		for(var i=0,c=poolArray.length;i<c;i++){
			if(poolArray[i]===objOrId)
				return i;
		}
		return -1;
	}
}
CachePool.prototype.unset=function(id){
	if(this.pool[getId(obj)]){
		this.pool[getId(obj)]=null;
	}
	
	for(var i=0,c=poolArray.length;i<c;i++){
		var obj=this.poolArray[i];
		if(obj&&getId(obj)==id){
			this.poolArray[i]=null;
			this.length--;
			this.nullCount++;
			break;
		}
	}
	return this;
}
CachePool.prototype.optimize=function(){
	var newPool={},newPoolArray=[],newLength=0;
	for(var x in this.pool){
		if(this.pool[x]){
			newPool[x]=this.pool[x];
			newPoolArray.push(newPool[x]);
			newLength++;
		}
	}
	this.pool=newPool;
	this.poolArray=newPoolArray;
	this.length=newLength;
	this.nullCount=0;
	return this;
}
CachePool.prototype.get=function(id){
	return this.pool[id];
}
CachePool.prototype.query=function(filter,options){
	options.limit=options.limit||20;
	filter=filter||{};
	var result=[],fetchCount=0,i=0;
	while(fetchCount<=options.limit){
		if(i>=this.poolArray.length)break;
		var obj=this.poolArray[i];
		var ok=!!obj;
		if(ok){
			for(var k in filter){
				if(obj[k]!==filter[k]){
					ok=false;
					break;
				}
			}
		}

		if(ok){
			result.push(obj);
			fetchCount++;
		}
		i++;
	}
	return result;
}

var postCacheList=new CachePool();
var userCacheList=new CachePool();*/

function overrideAJAX(){
	// register AJAX prefilter : options, original options
	$.ajaxPrefilter(function( options, originalOptions, jqXHR ) {
		var qC=options._query;
		if(qC){
			console.log("[ajaxPrefilter] queryContext found");
			var qc=qC.components,qq=qC.query;
			if(qc=="list"){
				//console.log("[ajaxPrefilter] caught cachable item");
				//wrap the options to save/load data
				cacheLMEntries(options);
			}
			return ;
		}
			
		originalOptions._error = originalOptions.error;
		// overwrite error handler for current request
		options.error = function( _jqXHR, _textStatus, _errorThrown ){
			if(originalOptions._autoRetry){
				console.log("[overrideAJAX] AutoRetry, option:",originalOptions);
				$.ajax(originalOptions);
			}else{
				if( originalOptions._error ) originalOptions._error( _jqXHR, _textStatus, _errorThrown );
			}
		};
	});
}

function cacheLMEntries(options){
	if(!expriUseCache)return;
	var _success=options.success;
	var _error=options.error;
	var qq=options._query.query;
	if(!qq.category&&!qq.sort&&!qq.user){
		//cache more
	}else{

	}
	options.success=function(resp,status,jqXHR){
		if(resp.status=="ok"){
			console.log(resp.list);
			var list=resp.list;
			for(var i=0,c=list.length;i<c;i++){
				//clone one maybe remove some options
				postCacheList.save($.extend({},list[i]));
			}
		}
		_success.apply(jqXHR,arguments);
	};

}

function loadFromLM(action,data,success,failure,autoRetry){
	data=data||{};
	if(!data.device){
		//console.log("[loadFromLM] MAC added to the req.");
		data.device=storageObject.load("mac");
	}
	var lowLevelUrl;/*&&data.sort=="date"&&!data.related*/
	if(expriUseLowLevelQuery&&action=="list"&&!data.related&&!data.user){
		data.sort="";
		data.access=myProfile.uid;/*mongo_api*/
		lowLevelUrl=void urlParam("http://localhost:7788/mongo_api/api/mock.list.php",data);
	}
	return $.ajax({url:lowLevelUrl||urlParam(URL_LM+action,data),
		_query:{
			components:action,
			query:data
		},
		dataType:"jsonp",
		timeout: 40000, /*40000*/
		success:function(resp){
			if(resp.status=="ok"){
				success(resp);
			}else{
				//stub
				if(failure)failure(resp.message);
				var errmsg=valueOrOriginal(resp.message,HASH.failureTranslation);
				notify.connectFailure("載入資料失敗 from LM!<br/>訊息: *** "+errmsg+" ***");
			}
		},
		error:function(xhr,errmsg,errdetailed){
			//stub
			if(errmsg=="abort"){
				notify.abort("嘗試重新整理中...",3000);
				return;
			}
			notify.connectFailure("無法與 LM 連線!<br/>錯誤訊息: "+HASH.exception[errmsg].txt);
		},
		_autoRetry:autoRetry
	});
}

function loadFromProxy(action,data,success){
	if(!URL_PROXY){
		notify.verbose("目前環境下無法使用 Proxy.<br/>視為請求成功。");
		success(null);
		return;
	}
	data.action=action;
	return $.ajax({url:urlParam(URL_PROXY,data),
		data:data,
		//dataType:"jsonp",
		timeout: 50000,
		success:function(resp){
			if(resp.status.http_code=="200"){
				success(resp.contents);
			}else{
				//stub
				notify.error("載入資料失敗 from Proxy!<br/>資料無效.");
			}
		},
		error:function(xhr,errmsg,errdetailed){
			//stub
			if(errmsg=="parsererror")return;
			if(errmsg.fatal)notify.connectFailure("無法與 Proxy 連線!<br/>錯誤訊息："+HASH.exception[errmsg].txt);
		}
	});
}

function postProxy(action,postdata,success){
	if(!URL_PROXY){
		notify.verbose("目前環境下無法使用 Proxy.<br/>視為請求成功.");
		success(null);
		return;
	}
	
	postdata=postdata||{};
	
	return $.ajax({url:urlParam(URL_PROXY,{action:action}),
		type: "POST",
		data: postdata,
		processData: false,
		contentType: false,
		success: function(resp){
			if(resp.status.http_code==200){
				var content=resp.contents;
				//Should searialize the data
				var bgn=content.indexOf("\r\n\r\n")+4;
				var end=content.lastIndexOf("}")+1;
				resp_obj=JSON.parse(content.substring(bgn,end));
				resp_obj._status=resp.status;
				console.log("Post Success: ",resp_obj);
				if(resp_obj.status=="error"){
					var errmsg=valueOrOriginal(resp_obj.message,HASH.failureTranslation);
					notify.error("POST 已成功執行, 但是結果似乎不對.<br/>訊息:<br/>"+errmsg);
				}else success(resp_obj);
			}else{
				var content=resp.contents.replaceAll("|","<br/>");
				notify.error("POST 執行失敗!<br/>HTTP Code: "+resp.status.http_code+"<br/>訊息:<br/>"+content);
			}
		},
		error: function(xhr,errmsg,errdetailed){
			if(errmsg.fatal)notify.connectFailure("POST 至 LM 失敗!<br/>錯誤訊息: "+HASH.exception[errmsg].txt);
		}
	});
}

function loadUserdata(action,data,success){
	if(!URL_USERDATA){
		notify.verbose("目前環境下無法使用 Userdata.<br/>視為請求成功.");
		success(null);
		return;
	}
	data=data||{};
	data.action=action;
	if(!data.mac){
		//console.log("[loadFromLM] MAC added to the req.");
		data.mac=storageObject.load("mac");
	}
	return $.ajax({url:urlParam(URL_USERDATA,data),
		//dataType:"jsonp",
		timeout: 40000,
		success:function(resp){
			if(resp.status.http_code==200){
				success(resp.content);
			}else{
				//stub
				//if(failure)failure(resp.content);
				notify.connectFailure("載入資料失敗 from Userdata!<br/>資料無效: "+resp.content);
			}
		},
		error:function(xhr,errmsg,errdetailed){
			notify.connectFailure("無法與 Userdata 連線!<br/>錯誤訊息: "+HASH.exception[errmsg].txt);
		}
	});
}

function postUserdata(action,postdata,success){
	if(!URL_USERDATA){
		notify.verbose("目前環境下無法使用 Userdata.<br/>視為請求成功.");
		success(null);
		return;
	}
	var getdata={action:action,mac:storageObject.load("mac")};
	postdata=postdata||{};
	return $.ajax({url:urlParam(URL_USERDATA,getdata),
		type: "POST",
		data: postdata,
		processData: false,
		contentType: false,
		success: function(resp){
			if(resp.status.http_code==200){
				var content=resp.content;
				if(resp.status=="ERROR")
					notify.error("POST 已成功執行, 但是結果似乎不對.<br/>Message: "+content);
				success(resp);
			}else{
				notify.error("Post Failed!<br/>HTTP Code: "+resp.status.http_code+"<br/>Message: "+resp);
			}
		},
		error: function(xhr,errmsg,errdetailed){
			if(errmsg.fatal)notify.connectFailure("POST 至 LM 失敗!<br/>錯誤訊息: "+HASH.exception[errmsg].txt);
		}
	});
}