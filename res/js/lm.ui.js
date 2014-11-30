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

function registerListUtil(scope){
	/*if(USE_MOBILE_RULE){
		//Note that vanillabox will be
		// called twice if we don't do cleanup.
		$("div.vnbx").remove();
		$('a.imglightbox').each(function(){
			$(this).vanillabox();
		});

	}else{*/
	
	/*! Since v1.44, JSON flavor :) */
	var scopeSel="",$scope=null;
	if(typeof scope=="undefined"){
		$scope=$;
	}else if(typeof scope=="string"){
		scopeSel=scope;
		$scope=$(scope);
		if(!$scope.length)$scope=$;
	}else{
		//when passing 'this', the scopeSel can't be set, 
		//due to the lack of selector.
		//Leave it blank.
		$scope=scope;
		scopeSel=$scope.selector;
	}
	
	//console.log("[registerListUtil] sel/jqObj: ",scopeSel,$scope);

	var utilArr=[
		/*0*/function(option){
			Shadowbox.setup(scopeSel+" a.imglightbox",option);
			return rtn;
		},
		/*1*/function(){
			$scope.find('*[data-toggle="popover"]').popover({
				container:"body",
				html:true,
				placement:function(){
					if($(window).width()<500)return "bottom";
					else return "right";
				},
				trigger:"hover",
				delay:{
					show:FX_POPOVER_SHOW_DELAY,
					hide:FX_POPOVER_HIDE_DELAY
				}
			});
			return rtn;
		},
		/*2*/function(){
			$scope.find("time.timeago").timeago();

			return rtn;
		}
	];
	var utilLen=utilArr.length;

	var rtn={
		setupLightbox:utilArr[0],
		registerPopOver:utilArr[1],
		registerTimeAgo:utilArr[2],
		registerAll:function(){
			for(var i=0;i<utilLen;++i)utilArr[i]();

		}
	};
	
	return rtn;
}

function popOverShownHandler(){
	var self=$(this);
	registerListUtil(self).setupLightbox();
}


function voteClick(e){
	var self=$(this);
	var btnList=self.parent().children();
	var data=self.data();
	var id=data.id;
	var func=data.func;
	var role=data.role;
	
	//get the other btn
	var theOther=btnList.eq(0);
	if(self[0]==theOther[0])theOther=btnList.eq(1);

	var data2=theOther.data();
	var func2=data2.func;
	var role2=data2.role;
	
	var classConst=COLOR_CLASS.VOTE_BUTTON;
	postVote(func,id,function(resp){
		self.removeClass()
			.addClass(classConst._common+" "+classConst[resp.message])
			.data("func",func=="clear"?role:"clear");
		if(func!="clear"&&func2=="clear")
			//if to enable one, clear the other
			theOther.removeClass()
				.addClass(classConst._common+" "+classConst.clear)
				.data("func",role2);
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
		//Note! the request will NOT contain the related section,
		// thus, frankly speaking, the returned data can't be seen as a regular post.
		//console.log(obj);
		// This will overwrite the main area
		var ctrl=that.parents(".list").eq(0);
		var isCompact=!ctrl.hasClass("autoheight");
		ctrl.replaceWith(renderPostListView(obj,isCompact));
		registerListUtil(ctrl).registerAll();
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
	getRelated({id:replyObject.id,before:replyObject._oldest,user:replyObject._user_filter});
}

function loadMoreAnnouncement(){
	setShow("#announcement-loading","",false);
	listAnnouncement({before:lastestAnnouncementID,count:10},false);
}

function refreshMain(){	/*loadMoreFN*/
	viewLoadMerge(clearParamTimeStamp({}),true);
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

	var isSpecialCategory=param.category&&param.category.indexOf("__")==0;

	if(param.user){
		if(param.user==myProfile.uid||param.user==myProfile.username
			||(isSpecialCategory&&isMyself(currentProfile))){
			s="自己";
			c=COUNT.HOMEPAGE;
		}else{
			s=currentProfile.name+" ";
			c=COUNT.NOTIFICATION;
		}
		s+="的"+getCategory(param.category);
		type="user";
	}else{
		if(param.category){
			type=param.category;
			s=getCategory(param.category);
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
			//v1.67 - fix typo
			c=COUNT.HOMEPAGE;
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
	if(param.append)
		mainLoader.load("list/"+param.append,deleteProp(param,"append"));
	else
		mainLoader.load("list",param);
}

function viewLoadMerge(param,clearbefore,parser){
	viewLoad($.extend(mainLoader.lastReq,param),clearbefore,parser);
}

function clearParamTimeStamp(param){
	param=param||{};
	param.before=null;
	param.after=param.after?OLDEST_TIMESTAMP:null;
	return param;
}

function getCategory(categoryStr){
	var tmp;
	if(categoryStr){
		if(categoryStr.indexOf("__")==0){
			if(categoryStr=="__badge"){
				return "獎獎堂";
			}
		}else{
			if(tmp=RENDER_ENG.category1[categoryStr])return tmp.label;
			else if(tmp=RENDER_ENG.category2[categoryStr])return tmp.label;
		}
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
		var topPos=parseInt(that.css("top"),10);
		//Animation is laggy, so no animation.
		//$('html').animate({ scrollTop: topPos },FX_BRING_TOP_DURATION);
		$('html,body').scrollTop(topPos);
	}
	else that.animate({ scrollTop: 0 },FX_BRING_TOP_DURATION);
}

//v1.70 proposal - move to lm.util.js
function getLoadingRing(cls){
	//v1.52, add fallback for browser with no css animation
	if(!isAnimationSupported())
		return TAG("div","text-center"+(cls?" "+cls:""),ICON("loading")+" Now Loading");
	var cir="";
	for(var i=0;i<5;i++)
		cir+=TAG("span","circle","");
	return TAG("div","loader-ring"+(cls?" "+cls:""),cir);
}

//v1.70 - this should not be written like this.
// need to separate the ui and the logic.
function wordCountUpdate(){
	var MAX_CHAR_OF_TEXTAREA=1<<10;
	var self=$(this);
	var text=self.val();
	var view=$(self.data("counter"));
	if(!view){
		console.warn("[wordCountUpdate] word counter is not accessible through UI.");
	}
	//the server might use different chars for line-breaking?
	//for accurate calculation, we need to get count of '\n's and double it.
	var count=text.length+occurrences(text,"\n");
	var diff=MAX_CHAR_OF_TEXTAREA-count;
	var warnMessage="";
	var countText=TAG("span","text-muted",count);
	if(diff<0){
		warnMessage=TAG("abbr","text-alert",
			"title='超過上限之後，多餘的字會被截斷。'",
			"(超過 "+TAG("span","text-bold",-diff)+" 字！)")+" ";
	}else if(diff<140){
		warnMessage="(還剩下 "+TAG("span","text-warning text-bold",diff)+" 字) ";
	}
	view.html(warnMessage+countText);
}

function occurrences(string, substring) {
  var n = 0;
  var pos = 0;
  var l=substring.length;

  while (true) {
    pos = string.indexOf(substring, pos);
    if (pos > -1) {
      n++;
      pos += l;
    } else {
      break;
    }
  }
  return (n);
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

