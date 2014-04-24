/*include lm.constants.js*/
var URL_LM="https://apollo.omcompany.com:5443/api/";
var URL_IMAGE="https://apollo.omcompany.com:5443/image/";
/*include lm.util.js*/

function TAGi(code,scale){
	return TAGl(imageLM(code,"m"),imageLM(code,"X"),scale,true);
}

//if autoScale is specified, the scale is ignored.
function TAGl(img,link,scale,autoScale){
	link=link||img;
	if(!autoScale)scale=scale||160;
	var sty="shadow"+(autoScale?" autoScaleImage":"");
	var attr="src='"+img+"'"+(scale?
			" style='width:"+scale+"px;height:"+scale+"px'"
		:"");
	return TAG("a","imglightbox","href='"+link+"' rel='player=img'",
		TAG("img",sty,attr,""));
}

function LINK(url,text){
	var label=text||url;
	//Truncate
	label=truncateText(label,40);
	var isBlank=" target='_blank'";
	if(url.indexOf("http://lm.twbbs.org")==0
		||url.indexOf("http://andy0130tw.qov.tw")==0
		||url.indexOf("http://learnmode.host22.com")==0)
		isBlank="";
	return TAG("a","","href='"+url+"'"+isBlank,ICON("new-tab-2")+" "+label);
}

function extractDate(d){
	return new Date(d.getFullYear(),d.getMonth(),d.getDate());
}

function dateGetDays(diff){
	var day=Math.round((extractDate(new Date())-extractDate(diff))/864e5);
	if(day==0)return "今天";
	if(day==1)return "昨天";
	if(day==2)return "前天";
	if(day<=7)return day+"天前";
	//Use default expression.
	return false;
}

function imageLM(code,size){
	return URL_IMAGE+code+(size?"?size="+size:"");
}

//String util
function nl2br(str){
	return str.replace(/\n/g, '<br/>\n');
}

function urlToLink(str){
	var exp=/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|;])/ig;
	//return str.replace(exp,"<a href='$1'>$1</a>"); 
	return str.replace(exp,function(match,p1,p2,offset,string){
		return " "+LINK(p1);
	});
}

function normalize(str){
	//The LM replaced " with \" and \ with \\, which is unnecessary!
	return str.replaceAll("\\\"","\"")
		.replaceAll("\\\\","\\")
		.replaceAll("\\'","'")
		.replaceAll("&","&amp;")
		.replaceAll("<","&lt;")
		.replaceAll(">","&gt;")
		//.replaceAll(" ","&nbsp;")
		.replaceAll("ς","　");
}

function markupContent(str){
	//
	//bold: \*\*([^*]*(?:\*[^*]+)*)\*\*
	//
	str=str.replace(/--\s*(.+?)\s*--/g,"<del>$1</del>")
		.replace(/\*\*\*\s*(.+?)\s*\*\*\*/g,"<strong><em>$1</em></strong>")
		.replace(/\*\*\s*(.*?)\s*\*\*/g,"<strong>$1</strong>")
		.replace(/\*(.+?)\*/g,
			function(match,p1,offset,string){
				//check spaces before & after `*` 
				if(p1.match(/^\s+|\s+$/g))return match;
				return "<em>"+p1+"</em>";
			})
		.replace(/__\s*(.+?)__\s*/g,"<u>$1</u>");

	return str;
}

function processContent(str,trim){
	if(trim){
		var trimmed=smartTrimmer(str);
		if(trimmed)return nl2br(urlToLink(markupContent(normalize(trimmed))))+TAG("span","text-muted","…(Read More)");
	}
	return nl2br(urlToLink(markupContent(normalize(str))));
}

function extractSubject(subjectObj){
	var rtn=[];
	for(var i=0;i<subjectObj.length;++i){
		rtn.push(subjectObj[i].id);
	}
	return rtn;
}

function needSubject(category){
	var __s=["question","answer","!badge","watch","annotation"];
	for(var i=0;i<__s.length;++i)if(category==__s[i])return true;
	return false;
}

/*!Main body starts here*/
var oldest="";
var id="";

var CATEGORY={"share":"愛分享","question":"大哉問","scrapbook":"剪貼簿"};

$(function(){
	//Alter hyperlink with href="#"
	$("a[href='#']").attr("href","javascript:void(0)");

	initListeners();

	$(window).on("hashchange",hashChangeHandler);
	hashChangeHandler();
});

function initListeners(){
	$("#menu-title").click(function(){
		$("body,html").animate({scrollTop:0},600);
	});
	$("#btn-loadmore").click(function(){
		$("#post-loading").removeClass("hide");
		loadFromLM("list",{related:id,before:oldest,sort:"date",count:30},addRelated);
	});
}

function addLightBox(){
	//do cleanup
	$("div.vnbx").remove();
	$('a.imglightbox').each(function(){
		$(this).vanillabox();
	});
}

function hashChangeHandler(){
	var nowHash=location.hash;
	id=nowHash.substr(1);
	if(!id){
		$("#post-main").html(TAG("h2","text-alert","Error: No post id specified."));
		return;
	}

	$("#post-related").empty();

	loadMainPost({id:id});
	loadRelated({related:id,count:30,sort:"date"});

	console.log("[hashChangeHandler] "+nowHash);

}


function loadFromLM(action,data,success,failure){
	data=data||{};
	if(!data.device){
		data.device=$.cookie("mac");
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
				console.log("載入資料失敗 from LM!<br/>訊息: *** "+errmsg+" ***");
			}
		},
		error:function(xhr,errmsg,errdetailed){
			//stub
			if(errmsg=="abort"){
				console.log("嘗試重新整理中...",3000);
				return;
			}
			console.log("無法與 LM 連線!<br/>錯誤訊息: "+HASH.exception[errmsg].txt);
		}
	});
}

//All obj should first be modified.
function modifyObj(obj,rawresp){
	var __st=new Date();
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

function loadMainPost(param){
	loadFromLM("read",param,function(resp){
		var obj=modifyObj(resp.list[0],resp);
		$("#post-float").html(
			TAG("span","fg-darkCyan",
				TAG("span","title",CATEGORY[obj.category]+" "+obj.score)+" Pts<br/>")
			+TAG("span","fg-grayLight",obj.ref_count+" 則回應")

		);

		$("#post-main").html(renderPost(obj));
		addLightBox();
	});
}

function renderPost(obj){
	return TAG("img","user-avatar shadow place-left",
		"src='"+imageLM(obj._user.image)+"'","")
			+TAG("div","user-sub",
				renderUserRaw(obj._user)
					+"<br/>"
					+TAG("div","user-datetime",dateConverter(obj.date))
			)
			+TAG("div","user-message",processContent(obj.message)
			+(obj.image?"<br/>"+TAGi(obj.image):""))
			
}

function loadRelated(param){
	$("#post-loading").removeClass("hide");
	loadFromLM("list",param,addRelated);
}

function addRelated(resp){
	oldest=resp.info.oldest;
	var arr=[];
	for(var x in resp.list){
		var obj=modifyObj(resp.list[x],resp);
		arr.push(renderPost(obj));
	}
	var ctrl=$("#post-related");
	var oriContent=ctrl.html();
	ctrl.html(oriContent+arr.join("<hr/>")+"<hr/>");
	switchEnabled("#btn-loadmore",resp.info.more);
	$("#post-loading").addClass("hide");
	//console.log(resp);
	addLightBox();
}

function renderUserRaw(user){
	if(user.roles[0]=="teacher")
		return TAG("strong","user-name ol-indigo","style='outline:3px dotted;'",user.name);
	return TAG("strong","user-name",user.name);
}