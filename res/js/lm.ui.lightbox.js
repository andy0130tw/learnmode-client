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
		var container=$("#sb-player .ext-userview");
		if(!container[0]){
			console.log("[addToUserLightbox] type=objmiss");
			return;
		};
		var container1=container.find(".userview-block");
		var container2=container.find(".userview-tool");
		if(!userProfile._rendered){
			$("#sb-player .ext-userview .userview-cover").attr("src",imageLM(userProfile.cover,"X"));
			container1.click(function(){
				alert(userProfile.desc?
						"自介：\n--------\n"
							+userProfile.desc
							+"\n--------\n"
						:"此人沒有自介！"
					);
			});
			container.find(".userview-image").attr("src",imageLM(userProfile.image));
			container1.find(".title").html(userProfile.name+" ("+userProfile.username+")");
			container1.find(".subtitle").html(userProfile.school+" "+(userProfile.class_name=="TH"?"老師":userProfile.class_name));
			container.css("opacity",1);
			container2.find(".userview-go").click(function(){
				currentProfile=userProfile;
				viewLoad({/*sort:"date",*/user:userProfile.username},true);
				modalHide();
				Shadowbox.close();
			});
		}
		
		//Dynamic contents don't need to prevent it.
		var userRelation=getRelationWithUser(userProfile);
		userRelation&&(userRelation+="‧");
		container.find(".userview-info").html(userRelation+
			("已關注 %%% 人‧被 @@@ 人關注"
				.replace("%%%",userProfile.following_count)
				.replace("@@@",userProfile.followers_count))
		);
		switchVisible(container1.find(".following"),userProfile.is_followed_by);
		var followingButton=container2.find(".userview-following");
		followingButton.data("id",userProfile.username);
		//Attach appropriate event listener
		followingButton.off().removeClass("danger info");
		if(isMyself(userProfile)){
			followingButton.attr("disabled","disabled").html(ICON("home")+" 你自己");
		}else if(userProfile.is_following){
			followingButton.addClass("danger").html(ICON("link-2")+" 取消關注").click(function(){
				postIfFollow($(this).data("id"),false);
			});
		}else{
			followingButton.addClass("info").html(ICON("link")+" 關注").click(function(){
				postIfFollow($(this).data("id"),true);
			});
		}
		userProfile._rendered=true;
	}
	console.log("[addToUserLightbox] type="+(userProfile?"ok":"pending"));
}

var detailedMood=[];
function addToMoodLightbox(){
	assert(detailedMood.length==5,"addToMoodLightbox","Mood is not loaded yet!");
	var container=$("#sb-player .ext-moodview .list-content").find("div");
	for(var i=0;i<5;++i){
		var arr=detailedMood[i],data=[];
		for(var j=0;j<arr.length;j++){
			var avatar=renderAvatarRaw(arr[j],"inline shadow userlightbox");
			var username=renderUserRaw(arr[j]);
			var datetime=TAG("small","["+dateConverter(arr[j]._mood_date)+"]");
			data.push(TAG("div","","style='display:inline-block'",avatar+username+"<br/>"+datetime));
		}
		container.eq(i).html(data.length?data.join(",&nbsp;"):TAG("span","text-muted","Nobody..."));
		
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
			var avatar=renderAvatarRaw(arr[j],"inline shadow userlightbox");
			var username=renderUserRaw(arr[j]);
			var datetime=TAG("small","["+dateConverter(arr[j]._vote_date)+"]");
			data.push(TAG("div","","style='display:inline-block'",avatar+username+"<br/>"+datetime));
		}
		container.eq(i).html(data.length?data.join(",&nbsp;"):TAG("span","text-muted","Nobody..."));
	}
	$(".ext-voterview").css("opacity",1);
	console.log("[addToVoterLightbox] type=ok");
}