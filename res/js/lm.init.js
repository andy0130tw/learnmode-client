USE_MOBILE_RULE=false;

//add console for IE
if(!console||!console.log)console={log:function(){}};

//Only entry
main();

function main(){
	//Init BEFORE dom ready
	//No utils can be used here.
	var LOADING_MARKUP='<div class="loader-ring">';
	for(var i=0;i<5;i++){
		LOADING_MARKUP+='<span class="circle"></span>';
	}
	LOADING_MARKUP+="</div>";

	$("#_loadingState .loading").prepend(LOADING_MARKUP);

	//Init lightbox
	Shadowbox.init(SHADOWBOX_DEFAULT_OPTION);
	//Init useMobileRule
	checkUseMobileRule();

	//wait dom ready
	$(init);
}

function init(){
	try{
		if(FREEZE)return;

		//Remove click delay
		if(typeof FastClick!="undefined")
			FastClick.attach(document.body);

		//Timer
		var __st=new Date();

		//Alter hyperlink with href="#"
		$("a[href='#']").attr("href","javascript:void(0)");

		//Nav buttons
		switchNavByType("user");
		//Alter AJAX failure
		overrideAJAX();
		//Init cookies
		storageObject.init();

		//v1.64+
		checkPerm();

		//Setting up listeners
		setupListeners();
		navBtnListeners();
		initOverlayButtons();
		
		translateMagnificPopup();
		//v1.64 - staging - already translated.
		//translateTimeago();
		$.magnificPopup.defaults.fixedBgPos=true;

		fillInConstants();
		loadExternalData();

		console.log("[Startup] "+(new Date()-__st)+"ms, start logging in.");
		
		initLogin();
	}catch(e){
		alert("Error occured while initializing!\n"+e.toString()+"\nPlease report the fatal error.");
		throw e;
	}
}


function fillInConstants(){
	$("#btn-user-name").html("Logging in...");
	$("#dp-mac").html(storageObject.load("mac"));
	$(".fill-version").html(VERSION_MAJOR+VERSION_MINOR+VERSION_COUNT);
	$(".fill-version-count").html(VERSION_COUNT);
	$(".fill-last-modify").html(LAST_MODIFY);
	$(".fill-random-tip").html(randomTip[Math.floor(Math.random()*randomTip.length)].replaceAll("|","<br/>"));
}

function setupListeners(){
	var __st=new Date();
	
	checkMAC();
	//Dynamically add classes
	$(".login-dialer button").addClass("large").css("width","33%").click(fillMAC);
	
	$("#accountBtn").click(showUserLightbox);
	$(".action-account").click(showUserLightbox);
	$("#logoutBtn").click(function(){navClick();confirmClearMAC();});
	$(".action-refresh").click(refreshMain);
	$("#nav-following").click(showFollowingPopup);
	$("#nav-follower").click(showFollowerPopup);
	
	$("#login-input-mac").keyup(checkMAC);
	
	$("#editInfoBtn").click(modalMyInfo);

	$("#pinRefreshBtn").click(checkAllPinPosts);
	$("#pinAllReadBtn").click(clearAllPinUnread);

	$(document)
		.on("click",".userlightbox",showUserLightbox)
		.on("click",".moodlightbox",showMoodLightbox)
		.on("click",".voterlightbox",showVoterLightbox)
		.on("click",'.action-reply',modalShowReply)
		.on("click",".action-award",modalShowAward)
		.on("click",".action-badgewinner",modalShowBadgeWinners)
		.on("click",'.action-vote',voteClick)
		.on("click",'.action-reveal-rm',readRMPostAndRender)
		.on("click",'.action-seek-this-person',seekReplyByPerson)
		.on("shown.bs.popover",'*[data-toggle="popover"]',popOverShownHandler);

	/*$(window).resize(
		_.debounce(function(){
			var $body=$("#root");
			var content=$body.html();
			$body.empty();
			setTimeout(function(){$body.html(content)},12000);
			console.log("[Resize] Triggered.");

		},500)
	);*/

	//v1.70 add word count warning
	$(document).on("input",".spy-char-counter",wordCountUpdate);

	console.log("[init/SetupListeners] "+(new Date()-__st)+"ms");
}

function loadExternalData(){
	var dataLoadObject=$("[data-load]");
	var extFinished=0;
	//Load external html data and reinit the components
	dataLoadObject.each(function(){
		var self=$(this);
		self.load(self.data("load"), function(){
			extFinished++;
			console.log("[~DataLoad] loaded "+self.data("load")
				+", "+extFinished+" / "+dataLoadObject.length);
			if(dataLoadObject.length==extFinished){
				reinit();
				initOnce();
				initHashRoutes();
			}
		});
	});
}

var initOnce=function(){
	var __st=new Date();

	//Init these only once, after the external data is loaded.
	$("#btn-loadmore").click(loadMore);
	$("#btn-loadmore-reply").click(loadMoreReply);
	$("#btn-loadmore-users").click(loadMoreUsers);
	$("#btn-loadmore-announcement").click(loadMoreAnnouncement);
	
	$(".action-refresh-reply").click(refreshReply);
	$(".action-refresh-by-score").click(sortReplyByScore);
	$(".action-refresh-reverse").click(sortReplyReverse);
	$("#action-toggle-pin-list").click(togglePinList);
	$(".action-pin-post").click(togglePinCurrentPost);
	$(".action-dismiss").click(modalHide);
	$("#postshare-category").change(postshareCategoryChange);

	//Fill in data
	
	for(var i=0;i<SUBJECT_CATEGORY_NAME.length;++i){
		//Add a base
		var subjectData="",j=1;
		$("#postshare-subject-category").append(TAG("option","","value='"+(i+1)+"'",SUBJECT_CATEGORY_NAME[i]));
		$("#postshare-subject-container").append(TAG("select","postshare-subject","multiple='multiple'",""));
		
		while(SUBJECT_MAP[String(i+1)+numFill(j,4)]){
			var key=String(i+1)+numFill(j,4);
			subjectData+=TAG("option","","value='"+key+"'",SUBJECT_MAP[key]);
			j++;
		}
		$(".postshare-subject").eq(i).html(subjectData);
	}
	//Add event listener
	$(".postshare-subject").change(changeSubjectSelection);
	$("#postshare-subject-category").change(postshareSubjectCategoryChange);
	//Handle default change
	postshareSubjectCategoryChange();
	//v1.74 - now do it just before showing modal 
	//postshareCategoryChange();

	$("#users-search").submit(searchUserSubmit);
	
	//Close panel by default
	//$("#reply-ok .panel-content").slideToggle();
	$("#popup-reply-accordion-content").collapse();
	
	//Init fastclick
	//FastClick.attach(document.body);

	$("#_loadingState")[0].outerHTML="";
	switchVisible("#header,#root",true);

	//v1.70 - activate word counters
	$(".spy-char-counter").trigger("input");

	//v1.75 - check support of XMLHttpRequest2
	if(!window.FormData||FormData.isPolyfilled){
		$("input[type='file']")
			.attr("disabled","disabled")
			.addClass("hide")
				.parent()
				.append(TAG("span","not-supported","抱歉！目前的環境不支援圖片上傳功能。"));

		var fd=window.FormData=function(){
			this.__content__={};
		};
		fd.prototype.append=function(k,v){
			this.__content__[k]=v;
		}
	}

	//Corrupt itself to prevent recalling it
	initOnce=function(){/*notify.warning("You can't call this function twice.");*/}

	console.log("[initOnce] ended "+(new Date()-__st)+" ms");
}

function initOverlayButtons(){
	//Bring to top
	$("#btn-bringtop").click(function(){$("html,body").animate({scrollTop:0},400)});
	$(window).scroll(function(){
        //if($('.pull-menu').css("display")=="none")return;
		if($(this).scrollTop()>800){
            $('#btn-bringtop').fadeIn("fast");
        }else{
            $('#btn-bringtop').stop().fadeOut("fast");
        }
    });
	$('#btn-bringtop').fadeOut("fast");
}


function checkUseMobileRule(){
	if(useLocalStorage){
		USE_MOBILE_RULE=!!localStorage.getItem("use-mobile")||false;
	}
	if(USE_MOBILE_RULE)console.log("[checkUseMobileRule] Rule applied.");
}

function translateTimeago(){
	$.timeago.settings.strings={
		prefixAgo:null,
		prefixFromNow:null,
		suffixAgo:"前",
		suffixFromNow:"後",
		seconds:"%d 秒",
		minute:"約 1 分鐘",
		minutes:"%d 分鐘",
		hour:"約 1 小時",
		hours:"%d 小時",
		day:"約 1 天",
		days:"%d 天",
		month:"約 1 個月",
		months:"%d 個月",
		year:"約 1 年",
		years:"%d 年",
		numbers:[],
		wordSeparator:""
	}
}