//All obj should first be modified.
function modifyObj(obj,rawresp,type){
	var __st=new Date();
	if(type=="announcement")
		obj._user=rawresp.users[obj.uid];
	else
		obj._user=rawresp.users[obj.from];
	if(rawresp.related){
		obj._related=obj.related?rawresp.related[obj.related]:null;
		obj._related_user=obj.related?rawresp.users[obj._related.from]:null;
	}
	//Replace voters
	if(obj.voters)
		for(var i=0;i<obj.voters.length;++i)
			obj.voters[i]=rawresp.users[obj.voters[i]];
	return obj;
}

/*function addToContent(resp){
	var __st1=new Date();
	var listArr=resp.list;
	lastestEntryID=resp.info.oldest;
	switchEnabled("#btn-loadmore",resp.info.more);
	// var data=[];
	// for (var x in listArr){
	// 	var obj=modifyObj(listArr[x],resp);
	// 	data.push(renderPostListView(obj));
	// }
	$("#mainContent").append(data.join(""));
	if(!listArr.length)$("#mainContent").append(listitemNull("沒有動態可顯示。"));
	setShow("#main-loading","",true);
	//Add lightbox listener
	addLightbox();
	var __st2=new Date();
	console.log("[addToContent/Render] "+(__st2-__st1)+"ms");
}

function addToThumbnails(resp){
	var __st1=new Date();
	var listArr=resp.list;
	lastestEntryID=resp.info.oldest;
	switchEnabled("#btn-loadmore",resp.info.more);
	var arr=[];
	for (var x in listArr){
		arr.push(renderPostImageView(modifyObj(listArr[x],resp)));
	}
	var data=processGrid(arr,4);
	$("#mainContent").append(TAG("div","grid",data.join("")));
	setShow("#main-loading","",true);
	//Add lightbox listener
	addLightbox();
	var __st2=new Date();
	console.log("[addToThumbnails/Render] "+(__st2-__st1)+"ms");
}*/

function addToAnnouncementPopup(resp){
	var listArr=resp.list;
	lastestAnnouncementID=resp.info.oldest;
	switchEnabled("#btn-loadmore-announcement",resp.info.more);
	for (var x in listArr){
		var obj=modifyObj(listArr[x],resp,"announcement");
		$("#announcement-body").append(renderAnnouncement(obj));
	}
	setShow("#announcement-loading","",true);
	addLightbox();
}

function addToUsersPopup(resp){
	setShow("#users-loading","#users-ok",true);
	var listArr=resp.list,userArr=resp.users;
	lastestUsersID=resp.info.oldest;
	switchEnabled("#btn-loadmore-users",resp.info.more);
	//Tricky, the searching result never contains oneself.
	if(userArr.length==0)$("#users-body").append(listitemNull("查無結果..."));
	for (var x in listArr){
		var user=userArr[listArr[x].user];
		//Maybe there is some useful data, merge them to the userobj.
		user._badge=listArr[x].badge;
		user._subject=listArr[x].subject;
		user._date=listArr[x].date;
		$("#users-body").append(renderUserListView(user));
	}
}

function addToReplyPopup(resp){
	var listArr=resp.list;
	replyObject._oldest=resp.info.oldest;
	if(!replyObject._newest)replyObject._newest=resp.info.newest;
	if(resp.list[0]){
		var idRelated=resp.list[0].related;
		if(pinList[idRelated]&&pinList[idRelated].unread){
			console.log("[addToReplyPopup] cleared");
			clearUnread(idRelated);
			postSavePinList();
		}
	}
		
	switchEnabled("#btn-loadmore-reply",resp.info.more);
	if(listArr.length==0){
		$("#reply-content").html(listitemNull("還沒有回應。"));
	}
	for (var a in resp.list){
		var obj=modifyObj(listArr[a],resp);
		//obj._user=userArr[obj.from];
		$("#reply-content").append(renderPostListView(obj,true));
	}
	finishReplyPopup();
}

function finishReplyPopup(){
	//Add lightbox listener
	addLightbox();
	//Show the result
	setShow("#reply-loading","#reply-ok",true);
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
}

function parseDetailedMood(resp){
	detailedMood=new Array(5);
	for(var i=0;i<5;++i)detailedMood[i]=[];
	for(var x in resp.list){
		var obj=resp.list[x];
		var user=resp.users[obj.user];
		//Modify user
		user._mood_date=obj.date;
		if(obj.mood>0)detailedMood[obj.mood-1].push(user);
	}
	//ready
	switchClass(".moodlightbox","success",true);
	switchEnabled(".moodlightbox",true);
}

function parseReply(resp){
	replyObject=modifyObj(resp.list[0],resp);
	//Add sort info
	replyObject._sort="date";

	$("#reply-body").html(renderCompactPost(replyObject));
	addLightbox();
	parseMood(resp);
	var replyBase=HASH.replyParser[replyObject.category]||HASH.replyParser._none;
	//If the obj is undefined, then don't show anything
	switchVisible("#reply-accordion,#reply-tool,#reply-content,#reply-bottom",!replyBase.none);
	switchVisible("#reply-mood,.moodlightbox",replyBase.mood);
	switchVisible(".action-refresh-by-score",replyObject.category=="question");
	switchVisible("#postreply-file-uploader",replyBase.allowImage);
	replyObject._replyBase=replyBase;
	if(!replyBase.none){
		$(".panel-header").children("span").eq(1).html(resp.list[0].ref_count);
		getRelated({id:resp.list[0].id});
	}else{
		finishReplyPopup();
	}
}

/*function saveNotificationCount(resp){
	console.log("[saveNotificationCount] resp=",resp);
	var oldObj=cookieObject.load("notificationCount");
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
	cookieObject.save("notificationCount",$.extend(oldObj,newObj));
}*/

var badgeObj={};

function addToAward(resp){
	switchEnabled("#btn-loadmore",false);
	var badgeArr=[];
	var level=[],levelObj={};
	var badgeCount=0;
	badgeObj={};
	for (var x in resp){
		var badge=resp[x];
		if(isLevel(badge.badge)){
			var b=HASH.levelName[badge.badge];
			var subject=badge.subject;
			var subjectName=SUBJECT_MAP[badge.subject];
			if(typeof badge.subject=="string"){
				//malformed subject
				subject+="@@@";
				subjectName=TAG("span","fg-emerald",ICON("film"))+" "+subjectName;
			}else{
				subjectName=TAG("span","fg-indigo",ICON("feed"))+" "+subjectName;
			}
			var currentLevel=levelObj[subject];
			if(!currentLevel||b[1]>=currentLevel[1])
				levelObj[subject]=[subjectName,b[1],b[0],new Date(badge.date)];
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
	$("#mainContent").append(
		TAG("h2","獎章 "+TAG("small","x"+badgeCount+" (只會顯示最高位階)"))
		+TAG("div","grid fluid",badgeData.join(""))
	);

	for(var x in levelObj)level.push(levelObj[x]);
	//Level Sort by date.
	level.sort(function(a,b){return b[3]-a[3]});
	//Convert date
	for(var i=0;i<level.length;++i)level[i][3]=dateConverter(level[i][3]);
	var columns=["科目","等級","等級名稱","獲得日期"];
	$("#mainContent").append(
		TAG("h2","等級"+TAG("small"," x"+level.length))+
		TAG("table","table fill-level hovered",TABLE_HEADER(columns)+TABLE(level))
	);
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
	lastestUsersID="";
	switchEnabled("#btn-loadmore-users",false);
}

