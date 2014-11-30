//Helper obj for responsive lightbox
function orientateLightbox(w,h){
	var win=$(window);
	var ww=win.width();
	if(ww<=640)//rect
		return {w:w*1.25,h:w};
	return {w:w,h:h};
}

function showUserLightbox(e){
	lightbox({
		content:$(".ext-userview")[0].outerHTML,
		player:"html",
		options: {onFinish:function(x){
			//Deferred element modification
			addToUserLightbox();
		}},
		height: 360,width: 600
	});
	//Load user info in background
	userProfile=null;
	readUserProfile({user:$(this).data("id")});
}

function showMoodLightbox(e){
	var o=orientateLightbox(900,450);
	lightbox({
		content:$(".ext-moodview")[0].outerHTML,
		player:"html",
		options: {onFinish:function(x){
				//Assume mood is loaded successfully
				assert(detailedMood.length==5,"showMoodLightbox","Mood is not loaded yet!");
				addToMoodLightbox();
				$(".ext-moodview").css("opacity",1);
		}},
		height: o.h,width: o.w
	});
}

function showVoterLightbox(){
	voter=[];
	var o=orientateLightbox(900,450);
	lightbox({
		content:$(".ext-voterview")[0].outerHTML,
		player:"html",
		options: {onFinish:function(x){
			//Deferred element modification
			addToVoterLightbox();
		}},
		height: o.h,width: o.w
	});
	getVoter({id:$(this).data("id"),count:COUNT.VOTER});
}

function addToUserLightbox(){
	if(userProfile){
		//Prevent rerender.
		var user=userProfile;
		var container=$("#sb-player .ext-userview");
		if(!container[0]){
			console.log("[addToUserLightbox] type=objmiss");
			return;
		};
		var container1=container.find(".userview-block");
		var container2=container.find(".userview-tool");
		if(!user._rendered){
			user._rendered=true;
			$("#sb-player .ext-userview .userview-cover").attr("src",imageLM(user.cover,"X"));
			/*container.find(".userview-block-outer").off()*/
			container.find(".userview-toggle").click(function(){
				//v1.64
				/*alert(user.desc?
					"自介：\n--------\n"
						+user.desc
						+"\n--------\n"
					:"此人沒有自介！"
				);*/
				container.find(".userview-viewport").toggleClass("alt");
			});
			container.find(".userview-desc").html(processContent(user.desc));
			container.find(".userview-misc").html(
				//"地點："+user.location
				"使用者UID："+user.uid
				//"<br/>使用者ID："+user.id
			);

			container.find(".userview-image").attr("src",imageLM(user.image));
			container1.find(".title").html(user.name+" ("+user.username+")");
			container1.find(".subtitle").html(user.school+" "+(user.class_name=="TH"?"老師":user.class_name));
			container.css("opacity",1);
			container2.find(".userview-go").click(function(){
				currentProfile=user;
				viewLoad({/*sort:"date",*/user:user.username},true);
				modalHide();
				Shadowbox.close();
			});

			//v1.64
			//registerListUtil(container).registerTimeAgo();
		}
		
		//Dynamic contents don't need to prevent it.
		var userRelation=getRelationWithUser(user)||"";
		userRelation&&(userRelation+="‧");
		container.find(".userview-info").html(userRelation+
			("已關注 %%% 人‧被 @@@ 人關注"
				.replace("%%%",user.following_count)
				.replace("@@@",user.followers_count))
		);
		switchVisible(container1.find(".following"),user.is_followed_by);
		var followingButton=container2.find(".userview-following");
		followingButton.data("id",user.username);
		//Attach appropriate event listener
		followingButton.off().removeClass("danger info");
		if(isMyself(user)){
			followingButton.attr("disabled","disabled").html(ICON("home")+" 你自己");
		}else if(user.is_following){
			followingButton.addClass("danger").html(ICON("link-2")+" 取消關注").click(function(){
				postIfFollow($(this).data("id"),false);
			});
		}else{
			followingButton.addClass("info").html(ICON("link")+" 關注").click(function(){
				postIfFollow($(this).data("id"),true);
			});
		}
	}
	console.log("[addToUserLightbox] type="+(user?"ok":"pending"));
}

var detailedMood=[];
function addToMoodLightbox(){
	assert(detailedMood.length==5,"addToMoodLightbox","Mood is not loaded yet!");
	var container=$("#sb-player .ext-moodview .list-content").find("div");
	for(var i=0;i<5;++i){
		var arr=detailedMood[i],data=[];
		for(var j=0;j<arr.length;j++){
			var avatar=renderAvatarRaw(arr[j],
				"inline shadow"+(!arr[j]._is_dummy?" userlightbox":""));
			var username=renderUserRaw(arr[j]);
			var datetime=TAG("small","["+dateConverter(arr[j]._mood_date)+"]");
			data.push(TAG("div","","style='display:inline-block'",avatar+username+"<br/>"+datetime));
		}
		container.eq(i).html(data.length?data.join("&nbsp;&nbsp;"):TAG("span","text-muted","Nobody..."));
		
	}
}

var voter=[];
function addToVoterLightbox(){
	var container=$("#sb-player .ext-voterview .list-content").find("div");
	if(!container[0]){
		console.log("[addToVoterLightbox] type=objmiss");
		return;
	};
	if(!voter.length){
		console.log("[addToVoterLightbox] type=pending");
		return;
	}
	for(var i=0;i<2;++i){
		var arr=voter[i],data=[];
		for(var j=0;j<arr.length;j++){
			var avatar=renderAvatarRaw(arr[j],
				"inline shadow"+(!arr[j]._is_dummy?" userlightbox":""));
			var username=renderUserRaw(arr[j]);
			var datetime=TAG("small","["+dateConverter(arr[j]._vote_date)+"]");
			data.push(TAG("div","","style='display:inline-block'",avatar+username+"<br/>"+datetime));
		}
		container.eq(i).html(data.length?data.join("&nbsp;&nbsp;"):TAG("span","text-muted","Nobody..."));
	}
	$(".ext-voterview").css("opacity",1);
	console.log("[addToVoterLightbox] type=ok");
}