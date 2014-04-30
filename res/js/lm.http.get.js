var dummyContent;

var lastestEntryID="";
var lastestAnnouncementID="";
var usersMoreFN=function(){};
var lastestUsersID="";

var SUBJECT=[];

var userProfile;
var currentProfile;

function readProfile(param){
	loadFromLM("profile/read",param,doLogin,doLoginFailure);
}

function readUserProfile(param){
	assert(param.user,"readUserProfile","id is missing.");
	loadFromLM("profile/read",param,function(resp){
		userProfile=resp.profile;
		addToUserLightbox();
	});
}

/*function listProfile(param,clearbefore){
	if(mainLoader.isRunning)mainLoader.nowReq.abort();
	setShow("#main-loading","",false);
	assert(param.count,"listProfile","Count not given.");
	mainLoader.render=addToContent2;
	mainLoader.load("list",param);
}

function listProfileThumb(param,clearbefore){
	//For scrapbook and awards(no clearbef)
	if(mainLoader.isRunning)mainLoader.nowReq.abort();
	setShow("#main-loading","",false);
	mainLoader.render=addToThumbnails;
	mainLoader.load("list",param);
}

function listAward(param,clearbefore){
	//There is no request!
	setShow("#main-loading","",true);
	addToAward(currentProfile.badges);
}*/

function listAnnouncement(param,clearbefore){
	if(clearbefore)$("#announcement-body").empty();
	$("#announcement-loading").html(getLoadingRing("center"));
	setShow("#announcement-loading","",false);
	loadFromLM("announcement/list",param,addToAnnouncementPopup);
	return param;
}

function getDetailedPost(param,onlyMainMessage){
	if(onlyMainMessage){
		loadFromLM("read",param,parseMood);
	}else{
		setShow("#reply-loading","#reply-ok",false);
		setShow("#reply-sub-loading","#reply-sub-ok",false);
		loadFromLM("read",param,parseReply);
		getDetailedMood({id:param.id,count:COUNT.MOOD});
	}
}

function getDetailedMood(param){
	detailedMood=[];
	//disable the btn
	switchClass(".moodlightbox","success",false);
	switchEnabled(".moodlightbox",false);
	loadFromLM("mood/list",param,parseDetailedMood);
}

function getRelated(param){
	$("#reply-content-loading").html(getLoadingRing("center"));
	setShow("#reply-content-loading","",false);
	assert(param.id,"getRelated","The request might be unsent.");
	var newParam={};
	for(var x in param){
		if(x=="id")newParam.related=param.id;
		else newParam[x]=param[x];
	}
	newParam.sort=newParam.sort||replyObject._sort;
	assert(newParam.sort,"getRelated","Sort not given.");
	newParam.count=COUNT.REPLY;
	loadFromLM("list",newParam,addToReplyPopup);
}

function getVoter(param){
	loadFromLM("vote/list",param,function(resp){
		voter=new Array(2);
		voter[0]=[];
		voter[1]=[];
		for(var x in resp.list){
			var item=resp.list[x];
			var user=resp.users[item.user];
			user._vote_date=item.date;
			if(item.vote=="up"){
				voter[0].push(user);
			}else if(item.vote=="down"){
				voter[1].push(user);
			}
		}
		addToVoterLightbox();
	});
}

/*function getNotificationCount(param){
	loadFromLM("count",param,saveNotificationCount);
}*/

function getPinList(){
	loadUserdata("load",{},initPinList);
}

function refreshReply(){
	clrReplyPopup();
	replyObject._newest=undefined;
	replyObject._sort="date";
	getRelated({id:replyObject.id});
}
function sortReplyByScore(){
	clrReplyPopup();
	replyObject._newest=undefined;
	replyObject._sort="score";
	getRelated({id:replyObject.id});
}

function sortReplyReverse(){
	clrReplyPopup();
	replyObject._newest=undefined;
	replyObject._sort="subject";
	getRelated({id:replyObject.id});
}