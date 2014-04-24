function overrideAJAX(){
// register AJAX prefilter : options, original options
$.ajaxPrefilter(function( options, originalOptions, jqXHR ) {
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

function loadFromLM(action,data,success,failure,autoRetry){
	data=data||{};
	if(!data.device){
		//console.log("[loadFromLM] MAC added to the req.");
		data.device=cookieObject.load("mac");
	}
	return $.ajax({url:urlParam(URL_LM+action,data),
		dataType:"jsonp",
		timeout: 40000,
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
		dataType:"jsonp",
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
		data.mac=cookieObject.load("mac");
	}
	return $.ajax({url:urlParam(URL_USERDATA,data),
		dataType:"jsonp",
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
	var getdata={action:action,mac:cookieObject.load("mac")};
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