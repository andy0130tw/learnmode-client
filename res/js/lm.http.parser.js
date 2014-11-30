var REPLY_PRESET={
	"share":{category:"comment",application:"reading",mood:true,allowImage:true},
	"question":{category:"answer",application:"reading",mood:false,allowImage:true},
	"scrapbook":{category:"comment",application:"scrapbook",mood:true,allowImage:false},
	"watch":{mood:true,none:true},
	_none:{category:undefined,application:undefined,mood:false,allowImage:false,none:true},
	
	//v1.61
	//v1.62 moved partially to expri
	"comment":{mood:false,hideSender:true},

};

//All obj should first be modified.
function modifyObj(obj,rawresp,type){
	if(!obj)return null;
	//filter out future obj, which are used to XSS ggt.tw
	if(new Date(obj.date)-new Date()>1e7)
		return {};
	if(type=="announcement")
		obj._user=rawresp.users[obj.uid]||DUMMY_USER;
	else
		obj._user=rawresp.users[obj.from]||DUMMY_USER;
	if(rawresp.related){
		obj._related=obj.related?rawresp.related[obj.related]:null;
		obj._related_user=obj.related?rawresp.users[obj._related.from]||DUMMY_USER:null;
	}
	//v1.61 expri
	if(typeof EXPRI_ALL_IS_RELATED!="undefined"&&obj.id!="00"){
		//relates to itself
		obj.related=obj.id;
		//create cyclic relationship
		obj._related=obj;
		obj._related_user=rawresp.users[obj.from]||DUMMY_USER;
	}
	
	correctCheatCategory(obj);
	
	//Replace voters
	if(obj.voters)
		for(var i=0;i<obj.voters.length;++i)
			obj.voters[i]=rawresp.users[obj.voters[i]]||DUMMY_USER;
	return obj;
}

function correctCheatCategory(obj){
	if(obj.category=="annotation"&&!isNaN(obj.url)){
		obj.category="practice";
		return true;
	}
	return false;
}

function addToAnnouncementPopup(resp){
	var listArr=resp.list;
	lastestAnnouncementID=resp.info.oldest;
	switchEnabled("#btn-loadmore-announcement",resp.info.more);
	var ctrl=$("#announcement-body"),buf="";
	for (var x in listArr){
		var obj=modifyObj(listArr[x],resp,"announcement");
		buf+=renderAnnouncement(obj);
	}
	ctrl.append(buf);
	setShow("#announcement-loading","",true);
	registerListUtil(ctrl).registerAll();
}

function addToUsersPopup(resp){
	setShow("#users-loading","#users-ok",true);
	var listArr=resp.list,userArr=resp.users;
	usersMoreFN._param=usersMoreFN._param||{};
	usersMoreFN._param.before=resp.info.oldest;

	switchEnabled("#btn-loadmore-users",resp.info.more);
	var ctrl=$("#users-body");
	//Tricky, the searching result never contains oneself.
	if(userArr.length==0)ctrl.append(listitemNull("查無結果..."));
	var buf="";
	for (var x in listArr){
		var user=userArr[listArr[x].user]||DUMMY_USER;
		//Maybe there is some useful data, merge them to the userobj.
		user._badge=listArr[x].badge;
		user._subject=listArr[x].subject;
		user._date=listArr[x].date;
		buf+=renderUserListView(user);
	}
	$("#users-body").append(buf);
	//v1.64 - activate timeago
	registerListUtil(ctrl.parent()).registerAll();
	$("#users-body-loading").empty();
	setShow("#users-body-loading","",true);
}

function addToReplyPopup(resp){
	var listArr=resp.list;
	replyObject._oldest=resp.info.oldest;
	if(!replyObject._newest)replyObject._newest=resp.info.newest;
	var refCount=0;
	if(resp.list[0]){
		var idRelated=resp.list[0].related;
		if(pinList&&pinList[idRelated]&&pinList[idRelated].unread){
			console.log("[addToReplyPopup] cleared");
			clearUnread(idRelated);
			postSavePinList();
		}
		
		//v1.64 - count move to here
		refCount=resp.related[idRelated].ref_count;
	}

	$("#reply-ok .panel-title > div").children("span").eq(1).html(refCount);
		
	switchEnabled("#btn-loadmore-reply",resp.info.more);
	if(listArr.length==0){
		$("#reply-content").html(listitemNull("還沒有回應。"));
	}
	var buf="";
	for (var a in listArr){
		var obj=modifyObj(listArr[a],resp);
		//obj._user=userArr[obj.from];
		buf+=renderPostListView(obj,true);
	}
	$("#reply-content").append(buf);
	finishReplyPopup();
}

function finishReplyPopup(){
	//Add lightbox listener
	registerListUtil("#reply-sub-ok").registerAll();
	//Show the result
	setShow("#reply-sub-loading","#reply-sub-ok",true);
	$("#reply-content-loading").empty();
	setShow("#reply-content-loading","",true);
	checkPinPostButton();
}

//Simplifed workflow
var replyObject={};

function parseMood(resp){
	resp=modifyObj(resp.list[0],resp);
	for(var i=0;i<6;++i){
		var moodbtn=$("#reply-mood button");
		var moodlabel=moodbtn.children("small").eq(i);
		switchClass(moodbtn.eq(i),"inverse",(i==resp.my_mood-1||(i==5&&resp.my_mood==0)));
		if(i<5)moodlabel.html(resp.moods[i]);
	}
	setShow("#reply-loading","#reply-ok",true);
}

function parseDetailedMood(resp){
	detailedMood=new Array(5);
	for(var i=0;i<5;++i)detailedMood[i]=[];
	for(var x in resp.list){
		var obj=resp.list[x];
		var user=resp.users[obj.user]||DUMMY_USER;
		if(user){
			//Modify user
			user._mood_date=obj.date;
			if(obj.mood>0)detailedMood[obj.mood-1].push(user);
		}
	}
	//ready
	switchClass(".moodlightbox","success",true);
	switchEnabled(".moodlightbox",true);
}

function parseReply(resp){
	replyObject=modifyObj(resp.list[0],resp);
	//Add sort info
	replyObject._sort="date";

	var ctrl=$("#reply-body");
	ctrl.html(renderCompactPost(replyObject));
	registerListUtil(ctrl).registerAll();
	parseMood(resp);
	var replyBase=REPLY_PRESET[replyObject.category]||REPLY_PRESET._none;
	//If the obj is undefined, then don't show anything
	switchVisible("#reply-tool,#reply-content,#reply-bottom",!replyBase.none);
	switchVisible("#reply-accordion",!replyBase.none&&!replyBase.hideSender);
	
	switchVisible("#reply-mood,.moodlightbox",replyBase.mood);
	//switchVisible(".action-refresh-by-score",replyObject.category=="question");
	switchVisible("#postreply-file-uploader",replyBase.allowImage);
	replyObject._replyBase=replyBase;
	if(!replyBase.none){
		//Set count
		//v1.64 - deferred count...
		getRelated({id:resp.list[0].id});
	}else{
		finishReplyPopup();
	}
}

/*function saveNotificationCount(resp){
	console.log("[saveNotificationCount] resp=",resp);
	var oldObj=storageObject.load("notificationCount");
	var newObj=resp.counts;
	//Calculate counts difference
	if(oldObj){
		for(var x in newObj){
			var diff=newObj[x]-oldObj[x];
			console.log("[saveNotificationCount] "+x+": "+oldObj[x]+"->"+newObj[x]);
			if(diff<0)notify.error("saveNotificationCount","Diff of "+x+" <0");
			$(".label.fill-count[data-category='"+x+"']").html(diff);
		}
	}
	storageObject.save("notificationCount",$.extend(oldObj,newObj));
}*/

var badgeObj={};

function addToAward(resp){
	switchEnabled("#btn-loadmore",false);
	var badgeArr=[];
	var level=[],levelObj={};
	var badgeCount=0;
	badgeObj={};
	var ctrl=$("#mainContent");
	for (var x in resp){
		var badge=resp[x];
		if(isLevel(badge.badge)){
			var b=HASH.levelName[badge.badge];
			var subject=badge.subject;
			var subjectName=SUBJECT_MAP[badge.subject];
			if(typeof badge.subject=="string"){
				//malformed subject
				//caused by addBadgeScore api
				subject+="@@@";
				subjectName=TAG("span","fg-emerald",ICON("film"))+" "+subjectName;
			}else{
				subjectName=TAG("span","fg-indigo",ICON("feed"))+" "+subjectName;
			}
			var currentLevel=levelObj[subject];
			if(!currentLevel||b[1]>=currentLevel[1])
				//v1.64 stub - progress bar
				levelObj[subject]=[subjectName,b[1],"",b[0],badge.date];
		}else{
			var ba=badge.badge.split("_");
			var key=ba[0]+badge.subject;
			var currentBadge=badgeObj[key];
			badgeCount++;
			badgeObj[key]=badgeObj[key]||[];
			badgeObj[key].push(badge);
		}
	}

	//Badge sort by kind
	for(var x in badgeObj){
		badgeObj[x].sort(function(a,b){
			return compareBadgeLevel(a.badge.split("_")[1],b.badge.split("_")[1]);
		});
		badgeArr.push(renderAward(badgeObj[x][badgeObj[x].length-1]));
	}
	var badgeData=processGrid(badgeArr,4);
	ctrl.append(
		TAG("h2","獎牌 "+TAG("small","x"+badgeCount+" (只會顯示最高位階)"))
		+TAG("div","grid fluid",badgeData.join(""))
	);

	for(var x in levelObj)level.push(levelObj[x]);
	//Level Sort by date.
	level.sort(function(a,b){return new Date(b[4])-new Date(a[4])});
	//Convert date
	for(var i=0;i<level.length;++i){
		level[i][2]=repeatStr("|",level[i][1])+repeatStr(TAG("span","fg-grayLighter","|"),16-level[i][1]);
		level[i][4]=dateConverter(level[i][4],true);
	}
	var columns=["科目","等級","","等級名稱","獲得日期"];
	ctrl.append(
		TAG("h2","等級"+TAG("small"," x"+level.length))+
		TAG("table","table fill-level hovered",TABLE_HEADER(columns)+TABLE(level))
	);

	//v1.64 - activate timestamp, which is originally not needed here
	registerListUtil(ctrl).registerTimeAgo();
}

function repeatStr(s,n){
	var rtn="";
	for(var i=0;i<n;i++)rtn+=s;
	return rtn;
}

function clrReplyPopup(alsoClearMain){
	if(alsoClearMain)$("#reply-body").empty();
	$("#reply-content").empty();
	//clr ori id
	replyObject._oldest="";
	switchEnabled("#btn-loadmore-reply",false);
}

function clrUsersPopup(){
	$("#users-body").empty();
	//clr ori id
	usersMoreFN._param=null;
	switchEnabled("#btn-loadmore-users",false);
}

