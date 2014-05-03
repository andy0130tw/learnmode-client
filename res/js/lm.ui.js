function modalShowReply(e){
	//modal("#popup-reply");
	var self=$(this);
	var id=self.data("id");
	//If mobile?
	/*if(USE_MOBILE_RULE){
		location.href="m/#"+id;
		return;
	}*/
	//upd marker
	if(self[0].nodeName=="BUTTON"){
		$(".marked").removeClass("marked");
		self.parent().parent().addClass("marked");
	}
	/*clrReplyPopup(true);
	$("#postreply-id").val(self.data("id"));
	getDetailedPost({id:self.data("id")});*/
	location.hash="#!/post/"+id+"";
	//History.pushState(null,"","#!/post/"+self.data("id"));
}

function registerListListener(){
	/*if(USE_MOBILE_RULE){
		//Note that vanillabox will be
		// called twice if we don't do cleanup.
		$("div.vnbx").remove();
		$('a.imglightbox').each(function(){
			$(this).vanillabox();
		});

	}else{*/
	Shadowbox.setup("a.imglightbox");
	//}

	//Init popOver
	$('*[data-toggle="popover"]').popover({
		container:"#root",
		html:true,
		trigger:"hover",
		delay: { show: 200, hide: 1200 }
	});

	//Init timeago
	$("time.timeago").timeago();
}

function voteClick(e){
	var self=$(this);
	var data=self.data();
	var id=data.id;
	var func=data.func;
	var classConst=COLOR_CLASS.VOTE_BUTTON;
	postVote(func,id,function(resp){
		self.removeClass().addClass(classConst._common+" "+classConst[resp.message]);
	});
}

/**
,{
	onOpen:function(){
		$("")
		console.log(this);
		//location.hash+="/?image="+;
	},
	onClose:function(){
		//Strip out ?...
		var qry=location.hash.split("?");
		location.hash=qry[0];
	}
}
**/

//RMMRMRMRM
function readRMPostAndRender(){
	var that=$(this);
	if(!that.data("rm"))return;
	var x=confirm("觀看被RM的貼文是一項禁忌的功能，於 2014/2/12 推出，請低調使用。\n還是要繼續嗎？");
	if(!x)return;
	that.html(ICON("busy")+" 載入RM貼文中...");
	loadFromProxy("RMpost",{id:that.data("rm"),mac:storageObject.load("mac")},function(resp){
		if(!resp)return;
		var obj=modifyObj(resp.list[0],resp);
		obj.flagged=false;
		obj._flagged=true;
		// This will overwrite the main area
		var isCompact=!that.parents(".list").hasClass("autoheight");
		that.parents(".list").replaceWith(renderPostListView(obj,isCompact));
		registerListListener();
		//that.data("rm",null);
	});
}

/******* LOAD MORE *******/
//var loadMoreFN=function(){};

function loadMore(){
	mainLoader.loadMore();
	//mainLoader.lastReq.before=lastestEntryID;
	//viewLoad(mainLoader.lastReq,false,loadMoreFN);
}

function loadMoreReply(){
	$("#reply-content-loading").html(getLoadingRing("center"));
	setShow("#reply-content-loading","",false);
	getRelated({id:replyObject.id,before:replyObject._oldest});
}

function loadMoreAnnouncement(){
	setShow("#announcement-loading","",false);
	listAnnouncement({before:lastestAnnouncementID,count:10},false);
}

function refreshMain(){	/*loadMoreFN*/
	viewLoad(deleteProp(mainLoader.lastReq,"before"),true);
}

/*
function clearMain(bool){
	if(!dummyContent)dummyContent=$("#mainContent").html();
	if(bool){
		$('*[data-toggle="popover"]').popover('destroy');
		//Alt, brutal, no animation:
		//$(".popover").remove();
		$("#mainContent").html(dummyContent);
	}
}*/

function viewRecognize(param,clearbefore){
	//clearMain(clearbefore);

	param=param||{};
	var s="",c="",type="";

	if(param.user){
		if(param.user==myProfile.uid||param.user==myProfile.username){
			s="自己";
			c=COUNT.HOMEPAGE;
		}else{
			s=currentProfile.name+" ";
			c=COUNT.NOTIFICATION;
		}
		s+="的"+getCategory(param.category);
		type="user";
	}else{
		if(param.category&&param.category.indexOf("_")!=0){
			s=getCategory(param.category);
			type=param.category;
			if(param.sort=="score"){
				c=COUNT.HOT;
			}else if(param.sort=="date"){
				c=COUNT.NOTIFICATION;
			}else{
				c=COUNT.NOTIFICATION;
			}
		}else if(param.sort){
			s="[不分類]";
			type="";
			c=COUNT.NOTIFICATION;
		}else{
			s="首頁";
			type="homepage";
			c=COUNT.NOTIFICATION;
		}
	}/*&&customFunc!=listProfile*/
	if(param.category=="scrapbook"&&mainLoader.parse==parsePostThumbView){
		c=COUNT.ALBUM;
	}

	if($("#pin-list").css("display")!="none")
		togglePinList();

	switchNavByType(type);
	navUpdate(param);
	setLocation(s);
	param.count=c;

	//return param;
	//mainLoader.lastReq=param;
	//loadMoreFN=customFunc||listProfile;
	//loadMoreFN(param);
}

function viewLoad(param,clearbefore,parser){
	mainLoader.clearBefore=clearbefore;
	mainLoader.parse=parser||parsePostListView;
	mainLoader.load("list",param);
}

function viewLoadMerge(param,clearbefore,parser){
	viewLoad($.extend(mainLoader.lastReq,param),clearbefore,parser);
}

function getCategory(categoryStr){
	var tmp;
	if(categoryStr){
		if(tmp=RENDER_ENG.category1[categoryStr])return tmp.label;
		else if(tmp=RENDER_ENG.category2[categoryStr])return tmp.label;
	}
	return "大聲公";
}

function setLocation(text){
	$("#nav-location").html(text);
}

function deleteProp(obj,prop){
	obj[prop]=null;
	return obj;
}

function replyBringToTop(){
	//Determine scroll mode
	var that=$('.mfp-wrap');
	if(that.css("position")=="absolute"){
		var topPos=parseInt(that.css("top"));
		//Animation is laggy, so no animation.
		//$('html').animate({ scrollTop: topPos },FX_BRING_TOP_DURATION);
		$('html,body').scrollTop(topPos);
	}
	else that.animate({ scrollTop: 0 },FX_BRING_TOP_DURATION);
}

function getLoadingRing(cls){
	var cir="";
	for(var i=0;i<5;i++)
		cir+=TAG("span","circle","");
	return TAG("div","loader-ring"+(cls?" "+cls:""),cir);
}

/******* VIEW MANAGEMENT *******/
/*var view=[];

function saveView(){
	view.push(mainLoader.lastReq);
	mainLoader.lastReq={};
	$("#root .content").eq(0).fadeOut({duration:FX_VIEW_DURATION,queue:false}).slideUp(FX_VIEW_DURATION);
	$("#root").prepend("<div class='content'>New Content "+$("#root .content").length+"!</div>");
	return $("#root .content").eq(0);
}

function restoreView(){
	mainLoader.lastReq=view.pop();
	$("#root .content").eq(0).remove();
	$("#root .content").eq(0).fadeIn({duration:FX_VIEW_DURATION,queue:false}).css('display','none').slideDown(FX_VIEW_DURATION);
}*/

