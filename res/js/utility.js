/*Core util*/
var _={};
_.debounce = function(func, wait, immediate) {
	var timeout, args, context, timestamp, result;

	var later = function() {
	  var last = $.now() - timestamp;

	  if (last < wait && last > 0) {
		timeout = setTimeout(later, wait - last);
	  } else {
		timeout = null;
		if (!immediate) {
		  result = func.apply(context, args);
		  context = args = null;
		}
	  }
	};

	return function() {
	  context = this;
	  args = arguments;
	  timestamp = $.now();
	  var callNow = immediate && !timeout;
	  if (!timeout) {
		timeout = setTimeout(later, wait);
	  }
	  if (callNow) {
		result = func.apply(context, args);
		context = args = null;
	  }

	  return result;
	};
  };
function localStorageLength(){
    var allStrings = '';
    for(var key in window.localStorage){
        if(window.localStorage.hasOwnProperty(key)){
            allStrings += window.localStorage[key];
        }
    }
    return allStrings.length;
};
function localStorageSpaceDisp(){
	var capa=localStorageLength();
	return capa ? (3 + ((capa*16)/(8*1024))).toFixed(3) + ' KB' : 'Empty (0 KB)';
}

//Useful assert statement
function assert(condition,scopeName,errorStatement){
	if(condition)return;
	var errorStr="Assert failure: "+scopeName+"<br/>"+errorStatement;
	if(notify&&notify.warning)notify.warning(errorStr);
	//To break the original function
	throw new Error(errorStr.replaceAll("<br/>",", "));
}

/*String util*/
String.prototype.replaceAll=function(a,b){return this.split(a).join(b)}

function urlParam(url,obj){
	var first=true;
	var __ADD_PARAM=function(key,value){
		url+=(first?"?":"&");
		first=false;
		url+=key+"="+value;
	}
	for(var arg in obj){
		var val=obj[arg];
		if(!val)continue;
		if(val instanceof Array){
			for(var i=0;i<val.length;++i){
				__ADD_PARAM(arg+"[]",val[i]);
			}
		}else{
			__ADD_PARAM(arg,val);
		}
	}
	console.log("[URLMaker] url="+url);
	return url;
}

function truncateText(str,limit){
	if(str.length<=Math.abs(limit))
		return str;
	str=limit>=0?str.slice(0,limit):str.slice(limit);
	return limit>=0?(str+TAG("span","text-muted","…")):str;
}

/*TAG util*/
function TAG(){
	//tag,sty,attr,text
	//The last is always text, so that we can omit some options
	if(arguments.length==1)return arguments[0];
	var text=arguments[arguments.length-1];
	arguments[arguments.length-1]=undefined;
	
	//Surrounding
	sty=arguments[1]?"class=\""+arguments[1]+"\"":"";
	attr=arguments[2]?attrConverter(arguments[2]):"";
	
	return "<"+arguments[0]+" "+sty+" "+attr+">"+text+"</"+arguments[0]+">";
}

function attrConverter(str){
	// " -> \" and ' -> "
	return String(str).split("\"").join("\\\"").split("'").join("\"");
}

function ICON(iconid){
	return TAG("i","icon-"+iconid,"");
}

/*Date util*/
function dateConverter(raw,useStamp){
	var d=new Date(raw);
	if(isNaN(d.getTime()))return "DATE INVAILD!";
	//Substitute it with XX days ago.
	var diff=typeof(dateGetDays)!="undefined"?dateGetDays(d):false;
	var yd=numFill(d.getFullYear(),4);
	var sd=numFill([d.getMonth()+1,d.getDate()],2).join("-");
	var td=numFill([d.getHours(),d.getMinutes(),d.getSeconds()],2).join(":");
	var dist=new Date()-d;
	var dfull=td;
	if(dist>=1296e5)dfull=sd+" "+dfull;
	if(dist>=29808e6)dfull=yd+"-"+dfull;
	if(useStamp)return TAG("time","timeago","datetime='"+raw+"'","")
		+TAG("span","datetime-full"," &middot; "+dfull);
	sd=diff||yd+"-"+sd;
	return sd+" "+td;
}

function formatDateTime(dateObj,format){
	//0 for both, 1 for only date, 2 for only time
	format=format||0;
	if(isNaN(dateObj.getTime()))return "DATE INVAILD!";
	return (format==0||format==1?dateObj.getFullYear() + '/'
		+ ('0' + (dateObj.getMonth()+1)).slice(-2) + '/'
		+ ('0' + dateObj.getDate()).slice(-2):"")
		+ (format==0?" ":"")
		+ (format==0||format==2?dateObj.getHours() + ':'
		+ ('0' + dateObj.getMinutes()).slice(-2) + ':'
		+ ('0' + dateObj.getSeconds()).slice(-2):"");
}

/*Number util*/
function numFill(numarr,space){
	var _onlyNum=false;
	if(typeof(numarr)=="number"){
		_onlyNum=true;
		numarr=[numarr];
	}
		
	for(var i=0;i<numarr.length;++i){
		numarr[i]=String(numarr[i]);
		while(numarr[i].length<space){numarr[i]="0"+numarr[i];}
	}
	return _onlyNum?numarr[0]:numarr;
}

function thousandSymbol(num){
	  num = num + "";
		var re = /(-?\d+)(\d{3})/
		while (re.test(num)) {
			num = num.replace(re, "$1,$2")
		}
		return num;
}

function roundTo(num,digit){
	var x=Math.pow(10,digit);
	return Math.round(num*x)/x;
}


/*Metro util*/
function reinit(area){
	var __st=new Date();
	$.Metro.initAccordions(area);
	$.Metro.initDropdowns(area);
	$.Metro.initInputs(area);
	$.Metro.initListViews(area);
	//$.Metro.initLives(area);
	$.Metro.initTabs(area);
	$.Metro.initPanels(area);
	console.log("[Reinit]"+(area?" Area="+area:"")+" "+(new Date()-__st)+"ms");
}
function navClick(func){
	if(func)func();
	if($(".pull-menu").css("display")=="none")return;
	$(".pull-menu").click();
}

/*CSS util*/
function setShow(loading,complete,show){
	//If show=true , show the result and hide the loading section.
	//If show=false, reverse the args. 
	if(!show){
		setShow(complete,loading,true);
		return;
	}
	switchVisible(loading,false);
	switchVisible(complete,true);
}

function switchClass(obj,className,condition){
	if(condition) $(obj).addClass(className);
		else $(obj).removeClass(className);
}
function switchVisible(obj,condition){
	if(condition) $(obj).removeClass("hide");
		else $(obj).addClass("hide");
}

function switchEnabled(obj,condition){
	var classes=["info","default","primary","inverse","success"];
	if(condition) {
		$(obj).removeAttr("disabled");
		for(var i=0;i<classes.length;++i)
			if($(obj).hasClass("_"+classes[i]))
				$(obj).removeClass("_"+classes[i]).addClass(classes[i]);
	}else{
		$(obj).attr("disabled","disabled");
		for(var i=0;i<classes.length;++i)
			if($(obj).hasClass(classes[i]))
				$(obj).removeClass(classes[i]).addClass("_"+classes[i]);
	}
}

/*mfp util*/
function translateMagnificPopup(){
	$.extend(true, $.magnificPopup.defaults, {
		tClose: '關閉 (ESC)',
		tLoading: '載入中...',
		gallery: {
			tPrev: '上一張 (LEFT)', // Alt text on left arrow
			tNext: '下一張 (RIGHT)', // Alt text on right arrow
			tCounter: '%curr% / %total%' // Markup for "1 of 7" counter
		},
		image: {tError: '<a href="%url%">本圖片</a>無法載入！' /* Error message when image could not be loaded */},
		ajax: {tError: '<a href="%url%">本內容</a>無法載入！' /* Error message when ajax request failed*/},
		inline: {tNotFound: '找不到引用的內容。請通知網頁作者！'}
	});
	console.log("[translateMagnificPopup] translated.")
}

function modal(instance,isModal,needZoom,otherSettings){
	//for debug
	//alert("modal debug.");
	//var src=.clone().removeClass("mfp-hide");

	var cfg={items:{src:$(instance)},
		type:"inline",
		removalDelay:250,
		modal:isModal,
		mainClass:"mfp-fade"+(needZoom?" mfp-zoom":"")};
	$.extend(true,cfg,otherSettings);
	$.magnificPopup.open(cfg);
	reinit();
	//return rtn;
}

function modalHide(){
	var __st1=new Date();
	$.magnificPopup.close();
	var __st2=new Date();
	console.log("[modalHide] "+(__st2-__st1)+"ms");
}

function currentModal(){
	return $.magnificPopup.instance.currItem;
}

/*DataTables util*/
DATATABLES_TRANSLATION={
	lengthMenu:"每頁顯示 _MENU_ 筆",
	zeroRecords:"無符合條件的記錄",
	info:"顯示第 _START_ ~ _END_ 筆資料，共 _TOTAL_ 筆",
	infoEmpty:"顯示 0 筆資料",
	infoFiltered:"(從 _MAX_ 筆記錄篩選)",
	loadingRecords:"載入中...",
	processing:"處理中...",
	infoPostFix:"",
	thousands:",",
	search:"搜尋：",
	paginate: {
		first:ICON("first-2")+"第一頁",
		last:ICON("last-2")+" 最末頁",
		next:"下一頁 "+ICON("next"),
		previous:ICON("previous")+" 上一頁"
	},
	aria: {
		sortAscending:  ": 遞增排序",
		sortDescending: ": 遞減排序"
	}
};

/*Shadowbox util*/

//Wrap the original shadowbox plugin to support opening another lightbox
//when one is already opened by setting up a timer.
// * Works not very smoothly for slower devices.
var pendingLightboxOption=null;

function lightbox(option){
	var onClose=function(x){
		setTimeout(function(){
			if(pendingLightboxOption){
				Shadowbox.open(pendingLightboxOption);
				pendingLightboxOption=null;
			}
		},400);
	};
	option.options=option.options||{onClose:onClose};
	option.options.onClose=onClose;
	if(Shadowbox.isOpen()){
		pendingLightboxOption=option;
		Shadowbox.close();
		return;
	}
	Shadowbox.open(option);
}

function getBase64Image(img) {
	try {
		var canvas = document.createElement('canvas');
		canvas.width = img.width;
		canvas.height = img.height;

		var ctx = canvas.getContext('2d');
		ctx.drawImage(img, 0, 0);
		
		var imgType = img.src.match(/(jpg|jpeg|png)/);
		if (imgType.length) {
			imgType = imgType[0] == 'jpg' ? 'jpeg' : imgType[0];
		} else {
			throw 'Invalid image type for canvas encoder.';
		}
		console.log(imgType,canvas.toDataURL('image/' + imgType));

		return canvas.toDataURL('image/' + imgType);
	} catch (e) {
		console && console.log(e);
		return 'error';
	}
}