var RENDER_ENG={
	category1:{
		"share":{
			label:"愛分享",
			label_alt:"貼文",
			base:"分享了一篇#貼文#。",
			buttonLabel:"評論",
			scoreFN:renderScore,contentFN:renderContent,reactFN:NULL/*stub*/
		},
		"question":{
			label:"大哉問",
			label_alt:"問題",
			base:"提出了一個#問題#。",
			buttonLabel:"回答",
			scoreFN:renderScore,contentFN:renderContent,reactFN:NULL
		},
		"scrapbook":{
			label:"剪貼簿",
			label_alt:"貼圖",
			base:"在剪貼簿上新增一則#貼圖#。",
			buttonLabel:"評論",
			scoreFN:renderScore,contentFN:renderContent,reactFN:NULL
		},
		"comment":{
			label:"評論",
			base:"回應了%%%的#&&&#。",
			base_norel:"發表了#回應#。",
			buttonLabel:"觀看",
			scoreFN:NULL,contentFN:renderContent,reactFN:NULL
		},
		"answer":{
			label:"回答",
			base:"回答了%%%所提的#&&&#。",
			base_norel:"發表了#回答#。",
			buttonLabel:"觀看",
			scoreFN:renderVote,contentFN:renderContent,reactFN:renderVoteButton/*stub*/
		},
		"course":{
			label:"課程",
			base:"在#Course#上",
			base_fallback:"在#Course#上的動態。",
			buttonLabel:"讀取",
			scoreFN:NULL,contentFN:renderContent,reactFN:NULL
		},
		"annotation":{
			label:"Textbook/Practice",
			base:"在#Textbook#上新增了一則註解。",
			buttonLabel:"讀取",
			scoreFN:NULL,contentFN:renderContent,reactFN:NULL
		},
		"practice":{
			label:"Practice",
			base:"在#Practice#上",
			base_fallback:"在#Practice#上的動態。",
			buttonLabel:"讀取",
			scoreFN:NULL,contentFN:renderContent,reactFN:NULL
		},
		"tutor":{label:"講座",base:"分享了一篇#講座#(已廢棄，只有早期貼文會出現)",scoreFN:renderScore,buttonLabel:"評論",contentFN:renderContent,reactFN:NULL/*stub*/},
		"watch":{label:"觀看影片",label_alt:"影片",base:"看了一部#影片#。",scoreFN:NULL,buttonLabel:"讀取",contentFN:renderWatch,reactFN:NULL}//bug
	},
	category2:{
		"!follow":{label:"關注",scoreFN:NULL,buttonLabel:"",contentFN:NULL,reactFN:NULL},
		"!emotion":{label:"甩表情",scoreFN:NULL,buttonLabel:"觀看",contentFN:NULL,reactFN:NULL},
		"!badge":{label:"等級/獎牌",scoreFN:NULL,buttonLabel:"",contentFN:renderBadgeImage,reactFN:NULL},
		"!vote":{label:"評分",scoreFN:NULL,buttonLabel:"觀看",contentFN:NULL,reactFN:NULL},
		"watch":null//bug
	}
}

function renderPost(obj,isCompact){
	try{
	var content="",op={};
	var user=obj._user;
	//In IE8, array's prototype will be polyfilled(corrupted).
	// A quick and dirty way to hide this is to check if the obj is undefined
	// IE8 is not supported offically, though.
	if(obj.category===undefined)return "";
	
	//v1.61 - decide whether the button needed to be displayed.
	// if isCompact but not correspondent, 
	// the button is still needed.
	var needButton=!isCompact;
	/*v1.61 condition: isCompact&&replyObject&&replyObject.id!=obj.related&&replyObject.id!=obj.id*/
	if(isCompact&&replyObject&&replyObject.id!=obj.id&&obj.ref_count>0)
		needButton=true;

	//v1.61 - decide whether the category is important.
	var needCategory=["share","question","scrapbook"].indexOf(obj.category)>=0;
	//v1.64 - add some info for matching and marking up content
	var contAlt=matchAltContent(obj,isCompact);
	//if(content)console.log(contAlt);

	if(op=RENDER_ENG.category1[obj.category]){
		//If score exist but scoreFN===NULL (玄奇樓),
		// the score must be perserved and be shown as vote.
		var scoreFN=op.scoreFN;
		if(obj.voters.length&&scoreFN==NULL)scoreFN=renderVote;
		content=(needButton?renderButton(obj,op.buttonLabel):"")
			+scoreFN(obj)+op.reactFN(obj)
			//+(isCompact?renderSeekButton(obj):"")
			+renderAvatar(user)
			+renderUser(obj)+"&nbsp;"
			+TAG("span",COLOR_CLASS.SCHOOL,user.school)+"&nbsp;"
			+(!isCompact?renderAbstract(obj,contAlt):"")
			+(isCompact&&needCategory?TAG("span",COLOR_CLASS.CATEGORY,"&nbsp;"+(op.label)):"")
			+renderApplication(obj)+"<br/>"
			+TAG("span","list-datetime",renderSSTitle(obj))
			+renderVotersRaw(obj)
			+op.contentFN(obj,contAlt)
			+renderURI(obj)
			+(obj.image?TAGi(obj.image):"")
			//+TAG("span","list-subtitle",obj);
	}else if(op=RENDER_ENG.category2[obj.category]){
		//Compact view
		content=(needButton?renderButton(obj,op.buttonLabel):"")
			+op.reactFN(obj)
			+renderAvatar(user)
			+renderUser(obj)+"&nbsp;"
			+TAG("span",COLOR_CLASS.SCHOOL,user.school)+"&nbsp;"
			+TAG("span",compactMsg(obj))+"<br/>"
			//+TAG("span","text-warning list-small","&nbsp;&nbsp;&nbsp;"+op.label)+"<br/>"
			+TAG("span","list-datetime",dateConverter(obj.date,true))+"<br/>"
			+op.contentFN(obj)
			+renderURI(obj)
			//+TAG("span","list-subtitle",obj);
	}else{
		content=(needButton?renderButton(obj,""):"")
			+renderScore(obj)
			+renderAvatar(user)
			+renderUser(obj)+"&nbsp;"
			+TAG("span",COLOR_CLASS.SCHOOL,user.school)
			+TAG("span","text-muted list-small"," @ "+(obj.application||"---"))
			+TAG("span","text-info list-small","&nbsp;&nbsp;&nbsp;"+("?: "+obj.category))+"<br/>"
			+TAG("span","list-datetime",dateConverter(obj.date,true))+"<br/>"
			+TAG("span","list-title text-alert","UNKNOWN CATEGORY:"+obj.category+". Raw JSON dump:")
			+TAG("span","list-remark",JSON.stringify(obj));
	}
	return content;
	}catch(e){
		notify.warning("有貼文無法正確排版! <br/>請截圖貼到 \"功能表->作者開發樓\" 協助回報這個錯誤, 謝謝! <br/>"+e.toString());
		//throw e;
		console.log("[renderPost] render failure, obj: ",obj," e:",e);
		return TAG("p",COLOR_CLASS.PARSE_ERROR,"ERROR occured in renderPost: "+e.toString())+obj;
	}
}

function renderPinPost(obj){
	try{
	var content="",user=obj._user;
	//Truncate and remove wrap
	obj.message=truncateText(obj.message.replaceAll("\n"," "),70);
	content=renderButton(obj,"詳細")
		//should be subitituted to +X
		+TAG("span","label fill-count place-right","...")
		+renderAvatar(user)
		+renderUser(obj)+"&nbsp;"
		+TAG("span",COLOR_CLASS.SCHOOL,user.school)+"&nbsp;"
		+"："
		+renderApplication(obj)+"<br/>"
		+TAG("span","list-datetime",renderSSTitle(obj))
		+renderContent(obj)
		+(obj.image?TAGi(obj.image,60):"")
	return content;
	}catch(e){
		notify.warning("追蹤列表無法正確排版! <br/>請截圖貼到 \"功能表->作者開發樓\" 協助回報這個錯誤, 謝謝! <br/>"+e.toString());
		return TAG("p","text-warning","ERROR occured in renderPost: "+e.toString())+obj;
	}
}
function renderPinPostReply(obj){
	var content="",user=obj._user;
	obj.message=truncateText(obj.message.replaceAll("\n"," "),20);
	content=renderAvatar(user,"inline")
		+renderUser(obj)+"&nbsp;"
		+TAG("span","text-muted list-small",user.school)
		+"："+obj.message;
	return content;
}


function renderAnnouncement(obj){
	var user=obj._user;
	var content=renderAvatar(user)
			+renderUser(obj)+"&nbsp;"
			+TAG("span",COLOR_CLASS.SCHOOL,user.school)+"<br/>"
			+TAG("span","list-datetime",dateConverter(obj.date,true))+"<br/>"
			+renderContent(obj)
			+(obj.image?TAGi(obj.image):"")
			+renderURI(obj)
			//+TAG("span","list-subtitle",obj);
	return listitem(content);
}

function renderCompactPost(obj){
	return renderPostListView(obj,true);
}

function renderWatch(obj){
	//var ytexp=/http:\/\/m.youtube.com\/#\/watch\?v=([\w\-]*).*/ig;
	var videoid=YOUTUBE_REGEX.exec(obj.url);
	var url=videoid?("http://www.youtube.com/embed/"+videoid[1]+"?autoplay=1&rel=0"):obj.url;
	var arr=obj.message.split("\n");
	var title=arr.shift();
	var message=arr.join("\n");
	return TAG("span","list-title",
		TAG("p",title)
			+processContent(message)+"<br/>"
		+TAG("blockquote","",ICON("right-quote")+" 影片："+LINK(url,obj.title)));
}

/*if (!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^\s+|\s+$/g, '');
  };
}*/

function renderUser(obj){
	return renderUserRaw(obj._user);
}
function renderUserRaw(user,base){
	var s=user.name;
	//console.log(user.name);
	if(base)base=base.replace("%%%",s);
	var sty=user._is_dummy?"text-warning":"userlightbox";
	var attr=user._is_dummy?"":"data-id='"+user.username+"'";
	if(user.roles[0]=="teacher"){
		sty+=" bd-indigo";
		attr+=" style='border:3px dotted;'";
	}
	return TAG("strong",sty,attr,base||s);
}

function renderAvatar(user,sty){
	sty=sty||"";
	if(!user._is_dummy)sty+=" userlightbox";
	return renderAvatarRaw(user,"icon shadow"+(sty?" "+sty:""));
}
function renderAvatarRaw(user,sty){
	var src=imageLM(user.image);
	var id=user.username;
	return TAG("img",sty,"src='"+src+"' data-id='"+id+"'","");
}

function renderVoteButton(obj){
	var classConst=COLOR_CLASS.VOTE_BUTTON;
	class1=obj.my_vote=="up"?
		{sty:classConst.up,func:"clear"}
		:{sty:classConst.clear,func:"up"};
	class2=obj.my_vote=="down"?
		{sty:classConst.down,func:"clear"}
		:{sty:classConst.clear,func:"down"};
	return TAG("div","vote-container place-right",
		renderButtonRaw(
			ICON("thumbs-up"),
			classConst._common+" "+class1.sty,
			{func:class1.func,id:obj.id,role:"up"}
		)
		+renderButtonRaw(
			ICON("thumbs-down"),
			classConst._common+" "+class2.sty,
			{func:class2.func,id:obj.id,role:"down"}
		)
	);
}

function NULL(){return "";}

function renderApplication(obj){
	if(obj.category!="scrapbook")return "";
	return TAG("span",COLOR_CLASS.APPLICATION," @ "+(obj.application));
}

function renderContent(obj,contAlt){
	//if alt message placement found, drop this
	//v1.63 - change cont to obj, add arg further
	var cont=processContent(obj.message);
	//v1.64 - not to check the type of the returning value
	if(contAlt){
		//!v1.64 - fix bug of potential XSS attack
		//! Haha, just forgot to add processContent function!
		cont=processContent(contAlt.further);
		//v1.63 stub, isCompact is not the standardized arg
		//v1.64 - now standardized
		if(contAlt.isCompact)cont=contAlt.content+"<br/>"+cont;
	}
	var cls="list-title";
	if(obj.flagged)
		return TAG("strong",cls+" "+COLOR_CLASS.RM_HINT,
			"data-rm='"+obj.id+"'",ICON("blocked")+" Removed by Moderator，點此觀看。");
	if(obj.message=="　"||obj.message==" ")cls+=" empty";
	if(obj._flagged){
		cls+=" "+COLOR_CLASS.RM_REVEALED;
		//replace cont
		cont=ICON("unlocked")+" <strong>[RM Revealed!]</strong><br/>"+cont;
	}
	return TAG("span",cls,cont);
}

//v1.64 - rename this function
function matchAltContent(obj,isCompact){
	var m=obj.message.replaceAll("_"," ");
	var op=RENDER_ENG.category1[obj.category];
	var rtn={content:"",further:"",isCompact:isCompact};
	//v1.61 - add some feature based on category
	if(obj.category=="course"){
		var coursere1=/^(對|对)(.*)(課程的評分為|课程的评分为)(.+)/;
		//v1.64 - add multiline matching
		var coursere2=/^(對|对)(.*)(課程，有以下的意見|课程，有以下的意见),'([\s\S]+)'/;
		var matched=false;
		if(m.match(coursere1)){
			m=m.replace(coursere1,"$1"+TAG("strong"," $2 ")+"$3"+TAG("strong"," $4 "));
			matched=true;
		}else if(m.match(coursere2)){
			m=m.replace(coursere2,function(match,p1,p2,p3,p4,off,str){
				//v1.63 - add further data
				rtn.further=p4;
				return p1+TAG("strong"," "+p2+" ")+p3+"：";
			});
			matched=true;
		}	
		//+"<br/><p class='tertiary-text'>$4</p>"
		//v1.64 - intact when no matching
		if(!matched){
			console.log("[renderContent] Try to match the content of category but failed.",m);
			//rtn.content=op.base_fallback;
			return rtn;//false;
		}
		rtn.content=m;
		return rtn;
	}else if(obj.category=="practice"){
		var practicePattern="$1"+TAG("strong"," $2 ")+"$3";
		var practicere=/^(考完)(.+)(的試卷|的试卷)/;
		m=m.replace(practicere,practicePattern);
		var practicere2=/(,獲得|获得)(.+)(分)$/
		m=m.replace(practicere2,practicePattern);
		rtn.content=m;
		return rtn;
	}
	return false;
}

function renderURI(obj){
	var url=obj.url;
	if(!url||url.match(/:\/\/$/)||obj.category=="watch")return "";
	if(url.indexOf("course:")==0){
		var courseid=url.match(/id=(.+)&chapterId=(.+)/);
		if(!courseid)return "";
		var videourl="http://course.learnmode.net/upload/video_"+courseid[2]+".mp4?direct=1";
		return TAG("blockquote",ICON("camera-2")+" Course 課程影片："+LINK(videourl,"Course #"+courseid[2]+" (ID="+courseid[1]+")"));
	}else if(url.indexOf("textbook:")==0){
		var bookid=url.match(/textbook:discussion=(.+)&page=(.+)/);
		if(!bookid)return "";
		//v1.64 - fix bug, page starts from 1 instead of 0
		bookid[2]++;
		var bookurl="http://textbook01.learnmode.net/upload/"+bookid[1]+".pdf?direct=1#page="+bookid[2];
		//As for other annotations...
		//https://lmadmin.learnmode.net/api/v2/annotations.json?uuid=
		return TAG("blockquote",ICON("book")+" Books 書籍PDF："+LINK(bookurl,"Books #"+bookid[1]+" (第 "+bookid[2]+" 頁)"));
	}else if(url.indexOf("content://")==0){
		var lmcontentid=url.match(/com.htc.learnmode\/(.+)\/(.+)/);
		if(!lmcontentid)return "";
		return TAG("blockquote",ICON("tag")+" 跳至貼文："
			+TAG("span","action-reply text-info pseudolink",
				"data-id='"+lmcontentid[2]+"'",
				RENDER_ENG.category1[lmcontentid[1]].label
					+" ["+postIdTruncate(lmcontentid[2])+"]"));
	}else if(obj.category=="practice"){
		//v1.63
		var test_id=url;
		url="http://practice.learnmode.net/upload/"+url+"/test_"+url+"_info.zip";
		return TAG("blockquote",ICON("calculate")+" Practice試題(測試)："+LINK(url,"Exam Archive #"+test_id));
	}
	else if(url.indexOf("http")==0){
		return TAG("blockquote",ICON("right-quote")+" 網頁："+LINK(url));
	}
	return TAG("blockquote",url+" (Can't be interpreted yet)");	
}

function renderSubject(obj,limit){
	var arr=[],len=obj.subjects.length,trimmed;
	for(var i=0;i<len;++i){
		arr.push(SUBJECT_MAP[obj.subjects[i].id]);
		if(i+1==limit&&len-arr.length>1){
			arr.push("…("+(len-arr.length)+")");
			trimmed=true;
			break;
		}
	}
	arr._trimmed=!!trimmed;
	return arr;
}

function renderPostListView(obj,isCompact){
	var sty="";
	if(obj.category=="!follow"){
		sty={inner:COLOR_CLASS.FOLLOW_BD,outer:"follow-outer"};
	}else if(obj.category=="!emotion"){
		sty={inner:COLOR_CLASS.EMOTION_BD,outer:"emotion-outer"};
	}else if(obj.category=="!vote"){
		sty={inner:COLOR_CLASS.VOTE_BD,outer:"vote-outer"};
	}else if(obj.category=="!badge"){
		sty={inner:COLOR_CLASS.BADGE_BD,outer:"badge-outer"};
	}
	return listitem(renderPost(obj,isCompact),!isCompact,sty);
}
function renderPinPostInner(obj){
	return TAG("div","list-content",renderPinPost(obj));
}
function renderPostImageView(obj){
	return thumbitem(imageLM(obj.image,"l"),"action-reply span3",TAG("div","overlay-fluid",obj.message),obj.id);
}

function renderAward(badge){
	var subject=SUBJECT_MAP[badge.subject];
	return thumbitem(BADGE(badge.badge),"bg-white action-award span3",
		TAG("div","text-center item-title",badgeTranslate(badge.badge))
		+(subject?TAG("div","text-center text-muted",TAG("small",subject)):"")
		+TAG("div","text-center fg-lightBlue item-title-secondary",dateConverter(badge.date,true))
		,badge.badge.split("_")[0]+badge.subject);
}

function renderUserListView(user){
	//LM wraps at a width of nearly 26 full chars.
	//Wrap it manually.
	//A line with over 26 chars should be splitted to two line which is equal.
	//
	var desc=processContent(user.desc);
	//console.log(desc);
	//if(desc.match(/([^\u0000-\u00ff]{13,})&nbsp;/g))console.log("WRAP FOUND!"+user.username);
	//desc=desc.replace(/([^\u0000-\u00ff]{21,25})&nbsp;/g,"$1<br/>");
	//desc=desc.replace(/([^\u0000-\u00ff]{26})/g,"$1<br/>");
	var relation=getRelationWithUser(user);
	var subject=SUBJECT_MAP[user._subject];
	var content=renderAvatar(user)
		+renderUserRaw(user,"%%% ("+user.username+")")+"&nbsp;"
		+TAG("span",COLOR_CLASS.SCHOOL,user.school+"/"+user.class_name)+"&nbsp;"
		+TAG("span","text-muted place-right",
			TAG("span",user.is_followed_by?COLOR_CLASS.LABEL_ACTIVE:"",ICON("pop-out")+user.following_count)
			+"‧"
			+TAG("span",user.is_following?COLOR_CLASS.LABEL_ACTIVE:"",ICON("pop-in")+user.followers_count)
			+"<br/>"
			+(relation||""))
		+(user._date?
			"<br/>"+TAG("span","list-datetime",
				(dateConverter(user._date,true))+(subject?", "+TAG("span","text-success",subject):""))
			:"")
		+TAG("pre","list-subtitle",desc);
	return listitem(content);
}

function renderButton(obj,label){
	if(obj.id=="00"&&!obj.related)return "";
	if(!label)return "";
	if(obj.flagged)label=ICON("locked-2")+" "+label;
	var id=obj.related||obj.id;
	//v1.62 revised
	if(obj.ref_count>0)id=obj.id;
	if(obj.category=="!vote"&&obj._related.category=="answer")
		id=obj._related.related||null;
	if(!id)return "";
	return renderButtonRaw(label,"large primary place-right action-reply",id);
}
function renderSeekButton(obj){
	var cls="place-right small action-seek-this-person";
	var data={user:obj._user.uid};
	if(replyObject._user_filter){
		cls+=" primary";
		data={};
	}else{
		cls+=" link";
	}
	return renderButtonRaw("*",cls,data);
}

function renderButtonRaw(label,sty,data,customTAG){
	if(!data)return "";
	var dataObj={};
	dataObj=(typeof data=="string")?{id:data}:data;
	var attr="";
	for(var x in dataObj){
		attr+="data-"+x+"='"+dataObj[x]+"' ";
	}
	return TAG(customTAG||"button",sty,attr,label);
}

function renderScore(obj){
	return renderScoreVoteRaw(obj.score,"info");
}
function renderVote(obj){
	var sty=obj.score>0?"success":"alert";
	return renderScoreVoteRaw(obj.score,sty);
}
function renderScoreVoteRaw(score,sty){
	sty="label place-right"+(score?" zoomin "+sty:"");
	return TAG("span",sty,score);
}

function renderAbstract(obj,contAlt){
	//v1.61, no rel should not be shown anymore (except RMreveal).
	var _op=RENDER_ENG.category1[obj.category],_norel;
	var template=RENDER_ENG.category1[obj.category].base;
	if(!obj.related&&(_norel=_op.base_norel))
		template=_norel;
	var tagre=/#(.+?)#/;
	template=template.replace(tagre,TAG("span","text-info"," $1 "));
	
	//v1.61 - add alt content
	//v1.64 - modify process
	if(contAlt)
		return contAlt.content?(template+contAlt.content):_op.base_fallback;

	//format template by recognizing some special characters
	if(template.indexOf("&&&")>=0)
		template=template.replace("&&&",renderPopLabel(obj));

	if(template.indexOf("%%%")<0)return template;
	return template.replace("%%%",TAG("strong",renderInlineName(obj,true)));
	//return template.replace("%%%",TAG("strong",renderInlineName(obj)));
}

function renderBadgeImage(obj){
	if(HASH.levelName[obj.badge])return "";
	var badge={};
	badge.badge=obj.badge;
	badge.subject=obj.subjects[0].id;
	badge.date=obj.date;
	return TAG("span","list-clearfix",TAGb(badge));
}

function renderSSTitle(obj){


	var rtn=dateConverter(obj.date,true);
	var subject=renderSubject(obj,5);
	var attr=subject._trimmed?"title='"+renderSubject(obj)+"'":"";
	rtn+=(needSubject(obj.category)?TAG("span","text-muted",attr," 科目："+subject):"");
	return rtn;
}

function renderVotersRaw(obj){
	var voters=[],myVote,selfVote,qmakerVote;
	var insertFirst=function(t){voters.unshift(TAG("big","text-bold",t));}
	for(var i=0;i<obj.voters.length;++i){
		var vuser=obj.voters[i];
		if(isMyself(vuser))myVote=true;
		else if(isSameUser(vuser,obj._user))selfVote=true;
		else if(obj._related_user&&isSameUser(vuser,obj._related_user))qmakerVote=true;
		else voters.push(vuser.name);
	}
	//note the order.
	if(selfVote)insertFirst("他自己");
	if(myVote)insertFirst("你");
	if(qmakerVote)insertFirst("發問者");

	return voters.length?
			("<br/>"+TAG("span","text-muted place-right voterlightbox",
				"data-id='"+obj.id+"'","誰評分："+voters.join(", "))):"";
}

function compactMsg(obj){
	var rin=function(){return TAG("strong",renderInlineName(obj))};
	var wi=function(cls){return TAG("span",cls,renderPopLabel(obj))};
	if(obj.category=="!follow"){
		return "正在"+TAG("span",COLOR_CLASS.FOLLOW,"關注")+"你。";
	}else if(obj.category=="!badge"){
		if(isLevel(obj.badge))//Level
			return "現在是 "
				+TAG("strong",SUBJECT_MAP[obj.subjects[0].id])
				+"科 的 "+TAG("strong",badgeTranslate(obj.badge))+" "
				+TAG("span",COLOR_CLASS.BADGE,"等級")+"！";
		else{//Badge
			var subject=SUBJECT_MAP[obj.subjects[0].id];
			if(obj.subjects[0].id==10001)subject=false;
			return "榮獲了 "+(subject?TAG("strong",subject)+"科 的 ":"")
				+TAG("strong",badgeTranslate(obj.badge))+" "
				+TAG("span",COLOR_CLASS.BADGE,"獎章")+"！";
		}
	}else if(obj.category=="!emotion"){
		if(obj.message==0)return "清除/維持了他對"
			+rin()+"的 "
			+wi(COLOR_CLASS.EMOTION)+" 的"
			+TAG("strong",COLOR_CLASS.EMOTION,"表情")+"。";
		return "給了"+TAG("strong",rin())
			+"的 "+wi(COLOR_CLASS.EMOTION)+" 一個 "
			+TAG("strong",COLOR_CLASS.EMOTION,HASH.mood[obj.message])+" 表情！";
	}else if(obj.category=="!vote"){
		if(obj.message=="clear")return "清除了他對"
			+TAG("strong",rin())+"的 "
			+wi(COLOR_CLASS.VOTE)+" 的"
			+TAG("strong",COLOR_CLASS.VOTE,"評價")+"。";
		return "給了"+TAG("strong",rin())+"的 "+wi(COLOR_CLASS.VOTE)+" 一個 "
			+TAG("strong",COLOR_CLASS.VOTE,
				obj.message=='up'?
					(ICON("thumbs-up")+" 讚")
					:(ICON("thumbs-down")+" 遜"))
			+"！";
	}else{
		return "<Unknown Information>";
	}
}

function renderInlineName(obj,containsAvatar){
	var related=obj._related;
	var reluser=obj._related_user;
	if(!reluser){
		console.log("[renderInlineName] The obj has been asked for its parent, but no reluser found.");
		return UNKNOWN();
	}
	var relusername=reluser.name;
	if(!relusername)return UNKNOWN();
	if(related){
		var noLink=false;
		if(reluser.id==obj.from){
			relusername="他自己";
		}else if(isMyself(reluser)){
			relusername="你";
		}else{
			var inlineAvatar="";
			//Bypass the test
			if(containsAvatar){
				inlineAvatar=renderAvatarRaw(obj._related_user,
					"inline-small userlightbox on-right-more")+" ";
			}
			//v1.64 - should not modify the user's data
			return inlineAvatar+" "+renderUserRaw(reluser)+" ";
		}
	}
	return relusername;
}

function renderPopLabel(obj){
	var relatedObj=obj._related;
	if(!relatedObj)return UNKNOWN();
	var _op=RENDER_ENG.category1[relatedObj.category];
	var _label=UNKNOWN();
	if(_op)
		_label=_op.label_alt||_op.label;
	var text=obj._related?_label:UNKNOWN();
	//create a box for it
	var img=(relatedObj.image?TAGi(relatedObj.image,80)+"<br/>":"");
	var txt=normalize(truncateText(relatedObj.message,150)).replaceAll("\n",TEXT_RETURN_ALT);
	//v1.64 - fix bug
	var content=img+txt.replaceAll("'","&#39;");
	return frag="<span data-toggle='popover'"
		+" data-placement='auto left'"
		+" data-title='"+RENDER_ENG.category1[relatedObj.category].label
		+RENDER_ENG.category1[relatedObj.category].scoreFN(relatedObj)+"'"
		+" data-content='"+content+"'"
		+" class='pop-over'>"+text+"</span>";
}

