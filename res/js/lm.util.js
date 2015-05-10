//debug only
//dump out obj
/*Object.prototype.toString=function(){
	var s="";
	var first=true;
	for(var x in this){
		if(x.indexOf("_")==0)continue;
		s+=(first?"":",")+x+":"+this[x];
		first=false;
	}
	return "{"+s+"}";
}*/

function urlData(url,str){
	return url+"?"+str;
}

function UNKNOWN(val){
	return TAG("span",COLOR_CLASS.UNKNOWN,val||"???");
}

function BADGE(badgeName){
	if(isLevel(badgeName))return "";
	return URL_BADGE_BASE+"badge_"+badgeName+"_240.png";
}

function TAGb(badge){
	//check if it exists
	var x=badgeSearch(badge.badge);
	if(!x[0]||!x[1])return "";
	return TAG("img","shadow-award action-award","src='"+BADGE(badge.badge)
		+"' data-badge='"+badge.badge
		+"' data-subject='"+badge.subject
		+"' data-date='"+badge.date
		+"'","");
}

//test if username is safe to be included in query.
//v1.72 - changed UID test. The server always use 
// lower case when querying username(but not uid). 
// This is usually OK if the user only use a-z0-9
// as a username but for now there is a changeId utility...
//v1.77 - fix bug: username could be undefined...
function UID(user){
	var un=user.username;
	if(un&&un==un.toLowerCase())
		return encodeURIComponent(un);
	return user.uid;
}

//Badge detail image (raw)
function TAGb2(badgeName){
	var img=BADGE(badgeName);
	return TAG("a","imglightbox","href='"+img+"' rel='player=img'",
		TAG("img","shadow-award","src='"+img+"'",""));
}

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

function strUntilInvalid(str,invaildStr){
	var pos=str.indexOf(invaildStr);
	return pos>0?str.slice(0,pos):str;
}

//var rootUrl=document.location.protocol+'//'+(document.location.hostname||document.location.host);
//From http://james.padolsey.com/javascript/parsing-urls-with-the-dom/, super fast!
//http://jsperf.com/url-parsing
function parseURL(url) {
    var a =  document.createElement('a');
    a.href = url;
    return {
        source: url,
        protocol: a.protocol.replace(':',''),
        host: a.hostname,
        port: a.port,
        query: a.search,
        /*params: (function(){
            var ret = {},
                seg = a.search.replace(/^\?/,'').split('&'),
                len = seg.length, i = 0, s;
            for (;i<len;i++) {
                if (!seg[i]) { continue; }
                s = seg[i].split('=');
                ret[s[0]] = s[1];
            }
            return ret;
        })(),*/
        file: (a.pathname.match(/\/([^\/?#]+)$/i) || [,''])[1],
        hash: a.hash.replace('#',''),
        path: a.pathname.replace(/^([^\/])/,'/$1'),
        relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [,''])[1],
        segments: a.pathname.replace(/^\//,'').split('/')
    };
}
/*//remove trailing ://
url=url.toLowerCase().replace(/^.+:\/{2,}/,"");
//remove fragments and query string
var pathName=strUntilInvalid(strUntilInvalid(url,"?"),"#");
var path=pathName.split("/");
var root=path.shift();
var nPath=[];
for(var i=0,c=path.length;i<c;i++){
	var node=path[i];
	if(node=="..")nPath.pop();
	else if(node&&node!=".")nPath.push(node);
}
return {hostname:root,path:nPath.join("/")};
}
*/


function LINK(url,text){
	var label=text||url;
	//Truncate
	if(label.length>=70){
		label=truncateText(label,25)+truncateText(label,-30);
	}else{
		label=truncateText(label,40);
	}
	
	var SERVER_LIST=["lm.twbbs.org","andy0130tw.qov.tw","learnmode.host22.com"];
	//for(var i=0;)
	var urlObj=parseURL(url);
	if(SERVER_LIST.indexOf(urlObj.host)>=0
		&&(urlObj.path=="/"||urlObj.path==document.path)){
		//console.log(urlObj);
		//internal post
		var hash=urlObj.hash;
		var postid;
		if(postid=/^!\/post\/(.+)/.exec(hash)){
			label=text||("內部貼文 ["+postIdTruncate(postid[1])+"]");
			return TAG("a","","href='#"+hash+"'",ICON("tag")+" "+label);
		}
	}
	return TAG("a","","href='"+url+"' target='_blank'",ICON("new-tab-2")+" "+label);
}

function TABLE(arr,reviver){
	var rtn="";
	for(var i=0;i<arr.length;++i){
		var tmp="";
		for (var j=0;j<arr[i].length;j++) {
			tmp+=TAG("td",arr[i][j]);
		};
		if(reviver)
			rtn+=TAG("tr",reviver(arr[i]),tmp);
		else
			rtn+=TAG("tr",tmp);
	}
	return rtn;
}

function TABLE_HEADER(arr){
	for(var i=0;i<arr.length;++i){
		arr[i]=TAG("th","text-left",arr[i]);
	}
	return TAG("thead",TAG("tr",arr.join("")));
}

function extractDate(d){
	return new Date(d.getFullYear(),d.getMonth(),d.getDate());
}

function extractTime(d){
	return new Date((d.getHours()*36e2+d.getMinutes()*60+d.getSeconds())*1e3);
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

function listitem(str,isCompact,sty,dataid){
	var appliedSty={};
	if(typeof sty=="object")appliedSty=sty;
	else appliedSty={inner:sty};
	return TAG("div",
		"list post"+(isCompact?" autoheight":"")+(appliedSty.outer?" "+appliedSty.outer:""),
		"tabindex='0'"+(dataid?" data-id='"+dataid+"'":""),
		TAG("div","list-content"+(appliedSty.inner?" "+appliedSty.inner:""),str));
}

function listitemNull(str,sty){
	return listitem(
			TAG("p","text-center",
				TAG("span","subheader-secondary",ICON("comments-5"))
					+"<br/>"+str)
		);
}

function thumbitem(src,divsty,content,id){
	return TAG("div","image-container cursorhand"+(divsty?" "+divsty:""),"data-id='"+id+"'",
		TAG("img","","src='"+src+"'","")+content);
}

function processGrid(arr,colCount){
	var buf=[],data=[];
	var __FLUSH=function(){data.push(TAG("span","row",buf.join("")));buf=[]};
	for (var x in arr){
		buf.push(arr[x]);
		if(buf.length==colCount)__FLUSH();
	}
	//Flush
	if(buf.length)__FLUSH();
	return data;
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

function postIdTruncate(id){
	return id.substring(0,8);
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
	//underline revised: -{2,3}(?!-)(.+?)-{2,3}
	// > still bug
	str=str.replace(/--[ ]*(.+?)[ ]*--/g,"<del>$1</del>")
		.replace(/\*\*[ ]*(.*?)[ ]*\*\*/g,"<strong>$1</strong>")
		.replace(/__[ ]*(.+?)__[ ]*/g,"<u>$1</u>");

	return str;
}

function processContent(str,trim){
	if(trim){
		var trimmed=smartTrimmer(str);
		if(trimmed)return nl2br(urlToLink(markupContent(normalize(trimmed))))+TAG("span","text-muted","…(Read More)");
	}
	return nl2br(urlToLink(markupContent(normalize(str))));
}

function isAnimationSupported(){
	//cache the ans
	var _ans=isAnimationSupported.ans;
	if(_ans!==undefined)return _ans;
	var animation=false,
		elm=$("body")[0],
		//animationstring='animation',
		//keyframeprefix='',
		domPrefixes='Webkit Moz O ms Khtml'.split(' ');//,
		//pfx  = '';

	if( elm.style.animationName !== undefined ) { animation = true; }    

	if( animation === false ) {
	  for( var i = 0; i < domPrefixes.length; i++ ) {
	    if( elm.style[ domPrefixes[i] + 'AnimationName' ] !== undefined ) {
	      //pfx = domPrefixes[ i ];
	      //animationstring = pfx + 'Animation';
	      //keyframeprefix = '-' + pfx.toLowerCase() + '-';
	      animation = true;
	      break;
	    }
	  }
	}
	return isAnimationSupported.ans=animation;
}

//Exprimental v1.3
/*function smartTrimmer(str){
	var s=str.split("\n");
	var charLimit=12;
	var lineLimit=5;
	var lineCnt=s.length;
	var curCnt=0;
	for(var i=0;i<lineCnt;i++){
		curCnt+=s[i].length+1;
		if(curCnt>=charLimit){
			console.log("[smartTrimmer] cut word by",charLimit);
			return str.substr(0,charLimit);
		}else if(i>=lineLimit){
			console.log("[smartTrimmer] cut line by ",curCnt,charLimit,i,lineLimit);
			return str.substr(0,curCnt);
		}
	}
	console.log("[smartTrimmer] Nothing");
	return false;
	//TEXT_RETURN_ALT;
}*/

function macConverter(mac){
	mac=mac.toUpperCase();
	var rtn=[],tmp="",fill="_",valid=true;
	for(var i=0;rtn.length<6;++i){
		var digit=i<mac.length?mac[i]:fill;
		if(digit==fill)valid=false;
		if(digit==fill||(mac[i]>='0'&&mac[i]<='9')||(mac[i]>='A'&&mac[i]<='F')){
			tmp+=digit;
			if(tmp.length==2){
				rtn.push(tmp);
				tmp="";
			}
		}
	}
	return {mac:rtn.join(":"),valid:valid};
}

function extractSubject(subjectObj){
	var rtn=[];
	for(var i=0;i<subjectObj.length;++i){
		rtn.push(subjectObj[i].id);
	}
	return rtn;
}

function isMyself(user){
	if(!myProfile)throw new Error("isMyself, myProfile is not ready!");
	return isSameUser(user,myProfile);
}

function isSameUser(user1,user2){
	return user1.id==user2.id;
}

function needSubject(category){
	var __s=["question","!badge","watch","annotation","course"];
	for(var i=0;i<__s.length;++i)if(category==__s[i])return true;
	return false;
}

function getRelationWithUser(user){
	if(user.is_blocked){
		if(user.is_blocked_by){
			return ICON("blocked")+" 互相封鎖";
		}else{
			return ICON("blocked")+" 已封鎖他";
		}
	}else{
		if(user.is_blocked_by){
			return ICON("blocked")+" 已封鎖你";
		}else if(user.is_following){
			if(user.is_followed_by){
				return ICON("tab")+" 互相關注";
			}else{
				return ICON("bars")+" 已關注他";
			}
		}else{
			if(user.is_followed_by){
				return ICON("bars")+" 已關注你";
			}
		}
	}
	return false;
}