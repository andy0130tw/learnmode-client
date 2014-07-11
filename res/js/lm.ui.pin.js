//Pin
var pinList;
var pinCount,pinFinish,pinDeferred,pinIdle=true;
var pinObject;

function initPinList(resp){
	resp=resp?resp.data:{};
	pinIdle=false;
	pinList={};
	pinObject={};
	pinCount=0;
	pinDeferred=0;
	for(var x in resp){
		var val=resp[x];
		if(val){
			addPinPost(x,val.count,val.unread);
			readPinPostContent(x);
		}
	}
	pinFinish=0;
	updatePinCount();
	console.log("[getPinList] Success",resp);

	setInterval(checkAllPinPosts,30000);
}

function readPinPostContent(id){
	loadFromLM("read",{id:id},initPinPost,null,true);
}


function checkSinglePinPost(id){
	loadFromLM("read",{id:id},updateSinglePinPost,null,true);
}


function initPinPost(resp){
	var obj=modifyObj(resp.list[0],resp);
	var id=obj.id;
	var oldCount=pinList[id].count;
	var newCount=obj.ref_count;
	var cntdiff=newCount-oldCount;
	var container=$("#pin-list .list[data-id='"+id+"']");
	container.removeClass("undone").html(renderPinPostInner(obj));
	//modify count
	console.log("initPinPost",oldCount,"->",newCount);
	if(cntdiff){
		//Have upd
		assert(cntdiff>0,"updateSinglePinPost","Negative difference.");
		pinList[id].unread+=cntdiff;
		pinList[id].count=newCount;
		//blocked by fhl
		loadFromLM("list",{related:id,sort:"date",count:Math.min(pinList[id].unread,COUNT.PIN)},updatePinPostReply,null,true);
		pinDeferred++;
	}else{
		pinFinish++;
	}
	if(pinList[id].unread){
		switchPinMark(id,true).find(".label.fill-count").html("+"+pinList[id].unread);
	}else{
		switchPinMark(id,false).find(".label.fill-count").html(0);
	}
	updatePinCount();
}


function updatePinPostReply(resp){
	pinFinish++;
	updatePinCount();
	var listArr=resp.list;
	if(!resp.list[0])return;
	//Grab related id by getting the first one...
	var id=resp.list[0].related;
	//pinObject[id].replyMessage=listArr;
	//upd info
	//pinList[id].newest=resp.info.newest;
	var container=$("#pin-list .list[data-id='"+id+"']");
	var msg="";
	for(var x in listArr){
		var obj=modifyObj(listArr[x],resp);
		msg+=TAG("span",renderPinPostReply(obj))+"&nbsp;&nbsp;&nbsp;";
	}
	if(container.find(".list-appendix").length)
		container.find(".list-appendix").html(msg);
	else
		container.append(TAG("div","list-appendix text-muted",msg));
}

function checkAllPinPosts(){
	if(!pinIdle)return;
	pinFinish=0;
	pinIdle=false;
	for(var x in pinList){
		checkSinglePinPost(x);
	}
}

function updateSinglePinPost(resp){
	var obj=modifyObj(resp.list[0],resp);
	var id=obj.id;
	var oldCount=pinList[id].count;
	var newCount=obj.ref_count;
	var cntdiff=newCount-oldCount;
	var container=$("#pin-list .list[data-id='"+id+"']");
	//modify count
	//console.log(oldCount,newCount);
	if(cntdiff){
		//Have upd
		assert(cntdiff>0,"updateSinglePinPost","Negative difference.");
		if(pinList[id].unread!=cntdiff&&pinIdle)notify.update({count:cntdiff,id:id,message:truncateText(obj.message.replaceAll("\n"," "),20)});
		pinList[id].count=newCount;
		pinList[id].unread+=cntdiff;
		if(pinIdle)	postSavePinList();
		else pinDeferred++;
		//blocked by fhl
		loadFromLM("list",{related:id,sort:"date",count:Math.min(pinList[id].unread,COUNT.PIN)},updatePinPostReply,null,true);
	}else{
		pinFinish++;
	}
	if(pinList[id].unread){
		switchPinMark(id,true).find(".label.fill-count").html("+"+pinList[id].unread);
	}else{
		switchPinMark(id,false).find(".label.fill-count").html(0);
	}
	updatePinCount();
}

/******UTIL******/

function addPinPost(id,cnt,unread){
	pinList[id]={unread:unread||0,count:cnt||0};
	pinObject[id]={};
	$("#pin-list").append(TAG("div",
		"list post autoheight undone",
		"tabindex='0' data-id='"+id+"'",
		TAG("div","list-content","載入 "+id+" 中...")));
	pinCount++;
	updatePinCount();
}

function removePinPost(id){
	pinList[id]=undefined;
	pinObject[id]=undefined;
	$("#pin-list .list[data-id='"+id+"']").remove();
	pinCount--;
	pinFinish--;
	updatePinCount();
}


/******UI******/

function clearUnread(id){
	switchPinMark(id,false).find(".label.fill-count").html(0);
	pinList[id].unread=0;
}

function clearAllPinUnread(){
	for(var x in pinList)clearUnread(x);
}

function updatePinCount(){
	var cnt=pinFinish,ttl=pinCount;
	var ctrl=$(".fill-pin-count");
	if(cnt==ttl){
		ctrl.html(ttl);
		ctrl.parent().removeClass("text-muted").addClass("text-info");
		pinReady=true;
		pinIdle=true;
		console.log("[updatePinCount] pinReady and pinIdle");
		//Notify at once
		if(pinDeferred){
			notify.update({once:true,count:pinDeferred});
			postSavePinList();
			pinDeferred=0;
		}
	}else{
		//Math.round(cnt/ttl*100)+"%"
		ctrl.html(TAG("div","progress-bar","data-role='progress-bar' data-value='0'",""));
		ctrl.find("div.progress-bar").data("value",cnt/ttl*100);
		ctrl.parent().removeClass("text-info").addClass("text-muted");
	}	
}

function togglePinCurrentPost(){
	var id=replyObject.id;
	if(!pinList){
		notify.error("追蹤列表尚未就緒, 請稍後再試.");
		return;
	}
	if(!pinList[id]){
		addPinPost(id,replyObject.ref_count);
		//init
		readPinPostContent(id);
		switchPinMark(id,false).find(".label.fill-count").html(0);
		notify.info("追蹤現在是ON",1000);
	}else{
		removePinPost(id);
		notify.info("追蹤現在是OFF",1000);
	}
	postSavePinList();
	checkPinPostButton();
}


function checkPinPostButton(){
	var ctrlStr="#reply-tool .action-pin-post";
	var hasPin=pinList!==undefined;
	switchVisible(ctrlStr,hasPin);
	if(hasPin){
		var data=pinList[replyObject.id];
		$(ctrlStr).html(data?ICON("star-3")+" 追蹤ON":ICON("star")+" 追蹤OFF");
		switchClass(ctrlStr,"primary",data);
	}
}

function togglePinList(){
	var l=$("#pin-list");
	if(l.css("display")=="none")
		l.fadeIn({duration:FX_VIEW_DURATION,queue:false}).css('display','none').slideDown(FX_VIEW_DURATION);
	else
		l.css("opacity",1).fadeOut({duration:FX_VIEW_DURATION,queue:false}).slideUp(FX_VIEW_DURATION);
}


function switchPinMark(id,condition){
	var ctrl=$("#pin-list .list[data-id='"+id+"']");
	switchClass(ctrl.find(".label.fill-count"),"warning zoomin",condition);
	switchClass(ctrl.find(".action-reply"),"primary",!condition);
	switchClass(ctrl.find(".action-reply"),"success",condition);
	return ctrl;
}
