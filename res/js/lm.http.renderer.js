var RENDER_ENG={
	category1:{
		"share":{label:"愛分享",base:"分享了一篇#貼文#。",scoreFN:renderScore,buttonLabel:"評論",contentFN:renderContent,reactFN:NULL/*stub*/},
		"question":{label:"大哉問",base:"提出了一個#問題#。",scoreFN:renderScore,buttonLabel:"回答",contentFN:renderContent,reactFN:NULL},
		"scrapbook":{label:"剪貼簿",base:"在剪貼簿上新增一則#貼圖#。",scoreFN:renderScore,buttonLabel:"評論",contentFN:renderContent,reactFN:NULL},
		"comment":{label:"評論",base:"回應了%%%的#&&&#。",scoreFN:NULL,buttonLabel:"觀看",contentFN:renderContent,reactFN:NULL},
		"answer":{label:"回答",base:"回答了%%%所提的#&&&#。",scoreFN:renderVote,buttonLabel:"觀看",contentFN:renderContent,reactFN:renderVoteButton/*stub*/},
		"course":{label:"課程",base:"在#Course#上的動態。",scoreFN:NULL,buttonLabel:"讀取",contentFN:renderContent,reactFN:NULL},
		"annotation":{label:"Textbook/Practice",base:"在#Textbook#上新增了一則註解。",scoreFN:NULL,buttonLabel:"讀取",contentFN:renderContent,reactFN:NULL},
		"practice":{label:"Practice",base:"在#Practice#上完成了一次考試。",scoreFN:NULL,buttonLabel:"讀取",contentFN:renderContent,reactFN:NULL},
		"tutor":{label:"講座",base:"分享了一篇#講座#(已廢棄，只有早期貼文會出現)",scoreFN:renderScore,buttonLabel:"評論",contentFN:renderContent,reactFN:NULL/*stub*/},
		"watch":{label:"觀看影片",base:"看了一部#影片#。",scoreFN:NULL,buttonLabel:"讀取",contentFN:renderWatch,reactFN:NULL}//bug
	},
	category2:{
		"!follow":{label:"關注",scoreFN:NULL,buttonLabel:"",contentFN:NULL,reactFN:NULL},
		"!emotion":{label:"甩表情",scoreFN:NULL,buttonLabel:"觀看",contentFN:NULL,reactFN:NULL},
		"!badge":{label:"等級/獎牌",scoreFN:NULL,buttonLabel:"",contentFN:renderBadgeImage,reactFN:NULL},
		"!vote":{label:"評分",scoreFN:NULL,buttonLabel:"觀看",contentFN:NULL,reactFN:NULL},
		"watch":null//bug
	}
}

var RELATED_CATEGORY={"share":"貼文","scrapbook":"貼圖","question":"問題"};

function renderPost(obj,isCompact){
	try{
	var content="",op={};
	var user=obj._user;
	if(op=RENDER_ENG.category1[obj.category]){
		content=(!isCompact?renderButton(obj,op.buttonLabel):"")
			+op.scoreFN(obj)+op.reactFN(obj)
			+renderAvatar(user)
			+renderUser(obj)+"&nbsp;"
			+TAG("span",COLOR_CLASS.SCHOOL,user.school)+"&nbsp;"
			+(!isCompact?renderAbstract(obj):"")
			+renderApplication(obj)+"<br/>"
			//+TAG("span","text-info list-small","&nbsp;&nbsp;&nbsp;"+(op.label))+"<br/>"
			+TAG("span","list-datetime",renderSSTitle(obj))
			+op.contentFN(obj)
			+renderURI(obj)
			+(obj.image?TAGi(obj.image):"")
			//+TAG("span","list-subtitle",obj);
	}else if(op=RENDER_ENG.category2[obj.category]){
		//Compact view
		content=(!isCompact?renderButton(obj,op.buttonLabel):"")+
			renderAvatar(user)
			+renderUser(obj)+"&nbsp;"
			+TAG("span",COLOR_CLASS.SCHOOL,user.school)+"&nbsp;"
			+TAG("span",compactMsg(obj))+"<br/>"
			//+TAG("span","text-warning list-small","&nbsp;&nbsp;&nbsp;"+op.label)+"<br/>"
			+TAG("span","list-datetime",dateConverter(obj.date))+"<br/>"
			+op.contentFN(obj)
			+renderURI(obj)
			//+TAG("span","list-subtitle",obj);
	}else{
		content=(!isCompact?renderButton(obj,""):"")
			+renderScore(obj)
			+renderAvatar(user)
			+renderUser(obj)+"&nbsp;"
			+TAG("span",COLOR_CLASS.SCHOOL,user.school)
			+TAG("span","text-muted list-small"," @ "+(obj.application||"---"))
			+TAG("span","text-info list-small","&nbsp;&nbsp;&nbsp;"+("?: "+obj.category))+"<br/>"
			+TAG("span","list-datetime",dateConverter(obj.date))+"<br/>"
			+TAG("span","list-title text-alert","UNKNOWN CATEGORY:"+obj.category+". Raw JSON dump:")
			+TAG("span","list-remark",JSON.stringify(obj));
	}
	return content;
	}catch(e){
		notify.warning("有貼文無法正確排版! <br/>請截圖貼到 \"功能表->作者開發樓\" 協助回報這個錯誤, 謝謝! <br/>"+e.toString());
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
			+TAG("span","list-datetime",dateConverter(obj.date))+"<br/>"
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

function renderUser(obj){
	return renderUserRaw(obj._user);
}
function renderUserRaw(user,base){
	if(base)base=base.replace("%%%",user.name);
	if(user.roles[0]=="teacher")
		return TAG("strong","userlightbox bd-indigo",
			"data-id='"+user.username+"' style='border:3px dotted;'",
			base||user.name);
	return TAG("strong","userlightbox",
		"data-id='"+user.username+"'",
		base||user.name);
}
function renderAvatar(user,sty){
	return renderAvatarRaw(user,"icon shadow userlightbox"+(sty?" "+sty:""));
}
function renderAvatarRaw(user,sty){
	return TAG("img",sty,"src='"+imageLM(user.image)+"' data-id='"+user.username+"'","");
}

function renderVoteButton(obj){
	class1=obj.my_vote=="up"?"success":"inverse";
	class2=obj.my_vote=="down"?"warning":"inverse";
	return renderButtonRaw(ICON("thumbs-down"),"place-right bg-hover-gray action-vote-down "+class2,obj.id)+
		renderButtonRaw(ICON("thumbs-up"),"place-right bg-hover-gray action-vote-up "+class1,obj.id);
}

function NULL(){return "";}

function renderApplication(obj){
	if(obj.category!="scrapbook")return "";
	return TAG("span",COLOR_CLASS.APPLICATION," @ "+(obj.application));
}

function renderContent(obj){
	if(obj.category=="course"){
		var coursere1=/(對)(.+)(課程的評分為)(.+)/;
		var coursere2=/(對)(.+)(課程，有以下的意見,)'(.+)'/;
		obj.message=obj.message.replace(coursere1,"$1"+TAG("strong"," $2 ")+"$3"+TAG("strong"," $4 "));
		obj.message=obj.message.replace(coursere2,"$1"+TAG("strong"," $2 ")+"$3"+"<br/>$4");
		return TAG("span","list-title",obj.message.replaceAll("_"," "));
	}else if(obj.category=="practice"){
		var practicere=/(考完)(.+)(的試卷)/;
		obj.message=obj.message.replace(practicere,"$1"+TAG("strong"," $2 ")+"$3");
		var practicere2=/(,獲得)(.+)(分)/
		obj.message=obj.message.replace(practicere2,"$1"+TAG("strong"," $2 ")+"$3");
		return TAG("span","list-title",obj.message.replaceAll("_"," "));
	}
	var cls="list-title";
	var cont=processContent(obj.message);
	if(obj.flagged)
		return TAG("strong",cls+" "+COLOR_CLASS.RM_HINT,
			"data-rm='"+obj.id+"'",ICON("blocked")+" Removed by Moderator，點此觀看。");
	if(obj.message=="　"||obj.message==" ")cls+=" empty";
	if(obj._flagged){
		cls+=" "+COLOR_CLASS.RM_REVEALED;
		cont=ICON("unlocked")+" <strong>[RM Revealed!]</strong><br/>"+cont;
	}
	return TAG("span",cls,cont);
}

function renderURI(obj){
	var url=obj.url;
	if(!url||url.match(/:\/\/$/)||obj.category=="practice"||obj.category=="watch")return "";
	if(url.indexOf("course:")==0){
		var courseid=url.match(/id=(.+)&chapterId=(.+)/);
		if(!courseid)return "";
		var videourl="http://course.learnmode.net/upload/video_"+courseid[2]+".mp4?direct=1";
		return TAG("blockquote",ICON("camera-2")+" Course 課程影片："+LINK(videourl,"Course #"+courseid[2]+" (ID="+courseid[1]+")"));
	}else if(url.indexOf("textbook:")==0){
		var bookid=url.match(/textbook:discussion=(.+)&page=(.+)/);
		if(!bookid)return "";
		var bookurl="http://textbook01.learnmode.net/upload/"+bookid[1]+".pdf?direct=1#page="+bookid[2];
		return TAG("blockquote",ICON("book")+" Books 書籍PDF："+LINK(bookurl,"Books #"+bookid[1]+" (第 "+bookid[2]+" 頁)"));
	}else if(url.indexOf("content://")==0){
		var lmcontentid=url.match(/com.htc.learnmode\/(.+)\/(.+)/);
		if(!lmcontentid)return "";
		return TAG("blockquote",ICON("tag")+" 跳至貼文："+TAG("span","action-reply text-info pseudolink","data-id='"+lmcontentid[2]+"'",RENDER_ENG.category1[lmcontentid[1]].label));
	}else if(url.indexOf("http")==0){
		return TAG("blockquote",ICON("right-quote")+" 網頁："+LINK(url));
	}
	return TAG("blockquote",url+" (Can't be interpreted yet)");	
}

function renderSubject(obj,limit){
	var arr=[],len=obj.subjects.length;
	for(var i=0;i<len;++i){
		arr.push(SUBJECT_MAP[obj.subjects[i].id]);
		if(i+1==limit&&len-arr.length>1){
			arr.push("...("+(len-arr.length)+")");
			break;
		}
	}
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
		+TAG("div","text-center fg-lightBlue item-title-secondary",dateConverter(badge.date))
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

	var content=renderAvatar(user)
		+renderUserRaw(user,"%%% ("+user.username+")")+"&nbsp;"
		+TAG("span",COLOR_CLASS.SCHOOL,user.school+"/"+user.class_name)+"&nbsp;"
		+TAG("span","text-muted place-right",
			TAG("span",user.is_followed_by?COLOR_CLASS.LABEL_ACTIVE:"",ICON("pop-out")+user.following_count)
			+"‧"
			+TAG("span",user.is_following?COLOR_CLASS.LABEL_ACTIVE:"",ICON("pop-in")+user.followers_count)
			+"<br/>"
			+getRelationWithUser(user))
		+(user._date?"<br/>"+TAG("span","list-datetime",
			(dateConverter(user._date))
			+(SUBJECT_MAP[user._subject]?", "+SUBJECT_MAP[user._subject]:"")):"")
		+TAG("pre","list-subtitle",desc);
	return listitem(content);
}

function renderButton(obj,label){
	if(obj.id=="00"&&!obj.related)return "";
	if(!label)return "";
	if(obj.flagged)label=ICON("locked-2")+" "+label;
	var id=obj.related||obj.id;
	if(obj.category=="!vote"&&obj._related.category=="answer")
		id=obj._related.related||null;
	if(!id)return "";
	return renderButtonRaw(label,"large primary place-right action-reply",id);
}
function renderButtonRaw(label,sty,dataid,customTAG){
	if(!dataid)return "";
	return TAG(customTAG||"button",sty,"data-id='"+dataid+"'",label);
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

function renderAbstract(obj){
	var template=RENDER_ENG.category1[obj.category].base;
	var tagre=/#(.+)#/;
	template=template.replace(tagre,TAG("span","text-info"," $1 "));
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
	var voters=[];
	for(var i=0;i<obj.voters.length;++i)voters.push(obj.voters[i].name);
	var rtn=dateConverter(obj.date)
	var subject=renderSubject(obj,5);
	rtn+=(needSubject(obj.category)?TAG("span","text-muted"," 科目："+subject):"")
		+(voters.length?
			"<br/>"+TAG("span","text-muted place-right voterlightbox",
			"data-id='"+obj.id+"'","誰評分："+voters.join(", ")):"");
	return rtn;
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
		if(obj.message==0)return "清除了他對"
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
		return "給了"+TAG("strong",rin())+"的"+wi(COLOR_CLASS.VOTE)+"一個 "
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
		console.log("[renderInlineName] The post is marked as rel, but no reluser found.");
		return UNKNOWN();
	}
	var relusername=reluser.name;
	if(!relusername)return UNKNOWN();
	if(related){
		reluser.name=" "+reluser.name+" ";
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
			return inlineAvatar+renderUserRaw(reluser);
		}
	}
	return relusername;
}

function renderPopLabel(obj){
	var relatedObj=obj._related;
	if(!relatedObj)return UNKNOWN();
	var _op=RENDER_ENG.category1[relatedObj.category];
	var text=obj._related?(RELATED_CATEGORY[relatedObj.category]||_op.label):UNKNOWN();
	//create a box for it
	var img=(relatedObj.image?TAGi(relatedObj.image,80)+"<br/>":"");
	var txt=normalize(truncateText(relatedObj.message,150)).replaceAll("\n",TEXT_RETURN_ALT);
	var content=img+txt.replaceAll("'","\"");
	return frag="<span data-toggle='popover'"
		+" data-placement='auto left'"
		+" data-title='"+RENDER_ENG.category1[relatedObj.category].label
		+RENDER_ENG.category1[relatedObj.category].scoreFN(relatedObj)+"'"
		+" data-content='"+content+"'"
		+" class='pop-over'>"+text+"</span>";
}

