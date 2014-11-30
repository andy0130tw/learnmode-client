EXPRI_SUBLABEL_SHOW_ID=false;
if(localStorage&&localStorage.getItem)
	EXPRI_SUBLABEL_SHOW_ID=!!localStorage.getItem("preference-show-id");


function experimental(num){
	var CAT1_ARR=["share","question","scrapbook","comment","watch","tutor"];
	if(num==1){
		
		for (var i=0,c=CAT1_ARR.length;i<c;i++) {
			RENDER_ENG.category1[CAT1_ARR[i]].reactFN=renderVoteButton;
		};
		
		alert("強制玄奇樓已設置。網頁重新整理後會失效。");
	}else if(num==2){
		postIfBlock(0,1);
	}else if(num==3){
		postIfBlock(0,0);
	/*}else if(num==4){
		var x=window.USE_MOBILE_RULE=!window.USE_MOBILE_RULE;
		localStorage.setItem("use-mobile",x?"true":"");
		alert("嘗試使用平板簡易模式：現在起"
			+(x?"啟用":"停用")
			+"。\n網頁重新整理不會失效，若要取消請重新選用此項。");*/
	}else if(num==6){
		slient(function(){experimental(1)});
		window.EXPRI_ALL_IS_RELATED=true;
		REPLY_PRESET.comment={category:"comment",application:"reading LMClient",mood:true,allowImage:true};
		alert("究極玄奇樓已設置(含有強制玄奇樓內的所有效果)。網頁重新整理後會失效。");
	}else if(num==7){
		if(!localStorage||!localStorage.setItem)
			alert("這個瀏覽器不支援此功能。");
		var key="preference-show-id";
		var lastResult=localStorage.getItem(key);
		if(lastResult){
			localStorage.removeItem(key);
			alert("變更顯示內容：學校");
		}else{
			localStorage.setItem(key,"true");
			alert("變更顯示內容：帳號");
		}
		window.EXPRI_SUBLABEL_SHOW_ID=!lastResult;
	}else{
		alert("無效的實驗功能！");
	}
	return false;
}

//avoid verbose
function slient(func){
	var _alert=alert;
	alert=function(){};
	func.call(this);
	alert=_alert;
}

function reloadWithReversed(b){
	// 2010-01-01T00:00:00Z
	if(b===undefined||b)
		viewLoadMerge({before:null,after:OLDEST_TIMESTAMP},1);
	else
		viewLoadMerge({after:null},1);
}

function convertToLMTimeStamp(ts){
	var d=new Date(ts);
	var arr=["Seconds","Minutes","Hours","Date","Month","FullYear"];
	var tsenc=0;
	for(var i=0;i<6;i++){
		var n=d["getUTC"+arr[i]]();
		if(i==4)n++;
		tsenc+=n*Math.pow(64,i);
	}
	return "T000"+tsenc.toString(16).toUpperCase();
}

//CONST_BLACK_LIST=["3fe6b59c7aadc9a1412016ade6e210b6d2aa4884"];

function checkPerm(){}

function iterate(f,v,c){
	var rtn=v;
	while(c>0){
		rtn=f(rtn);
		c--;
	}
	return rtn;
}

/*! For the person, who is constantly urging me to answer the question: If you read the source again, I tell you why I banned you. All because the idea of our production are too similar. And, frankly speaing, you are copying my ideas without mentioning me. OK. I end up putting a linense. That's all. Period. */

//this should not be used in production.
/*(function(){
	var w=window;
	var _setI=w.setInterval;
	var _clearI=w.clearInterval;
	var _list={};
	w.setInterval=function(){
		var token=_setI.apply(this,arguments);
		_list[token]=arguments;
		return token;
	};
	w.clearInterval=function(){
		arguments[0]&&(_list[arguments[0]]=null);
		return _clearI.apply(this,arguments);
	};
	w.listInterval=function(){return _list}
})();*/