function openPostShareForm(){
	setShow("#postshare-ok","#postshare-processing",false);
	modal("#popup-postshare",false,true);
}
function openNewsForm(){
	modal("#popup-news",false,true);
}

function showFollowerPopup(){
	showUsersPopup((isMyself(currentProfile)?"":currentProfile.name+" 的 ")+"粉絲團 ("+currentProfile.followers_count+")");
	switchVisible("#users-search",false);
	searchFollower(null,true);
	usersMoreFN=searchFollower;
}

function showFollowingPopup(){
	showUsersPopup((isMyself(currentProfile)?"":currentProfile.name+" 的 ")+"我關注 ("+currentProfile.following_count+")");
	switchVisible("#users-search",false);
	searchFollowing(null,true);
	usersMoreFN=searchFollowing;
}

function showUsersPopup(title){
	modal("#popup-users");
	clrUsersPopup();
	setShow("#users-loading","#users-ok",false);
	$("#popup-users").find("h3").html(title);
	lastestUsersReq="";
}

function modalShowAwardRaw(badgeList){
	showUsersPopup("獎牌");
	clrUsersPopup();
	switchVisible("#users-search",false);
	switchVisible("#users-award",true);
	//Deferred loading process
	setShow("#users-loading","#users-ok",true);
	var badgeName=badgeList[badgeList.length-1].badge;
	var badgeDetailed=badgeSearch(badgeName);
	var badgeSubject=SUBJECT_MAP[badgeList[0].subject];
	if(badgeSubject)badgeSubject="<br/>"+badgeSubject;
	else badgeSubject="";

	$("#users-award-img").html(TAGb2(badgeName));
	addLightbox();
	$("#users-award-badgename").html(badgeDetailed[0][0]+badgeDetailed[1]+TAG("small",badgeSubject));
	$("#users-award-desc1").html(badgeDetailed[0][1][0].replaceAll("|","<br/>"));
	$("#users-award-desc2").html(badgeDetailed[0][1][1].replaceAll("|","<br/>"));

	$(".users-award").removeClass("info");
	
	//Transfer data
	var badgeObj=new Array(3);
	for(var i=0;i<badgeList.length;++i){
		var o=badgeOrder(badgeList[i].badge);
		badgeObj[o]=badgeList[i];
	}
	var last=0;
	for(var i=0;i<3;++i){
		var container=$(".users-award").eq(i).children("td");
		container.eq(1).html(badgeDetailed[0][2][i]);
		if(badgeObj[i]){
			var nowBadge=badgeObj[i].badge;
			last=i;
			container.eq(2).html(dateConverter(badgeObj[i].date));
			container.eq(3).html(renderButtonRaw("觀看","success action-badgewinner",nowBadge));
		}else{
			container.eq(2).html("...");
			container.eq(3).html("...");
		}
	}
	$(".users-award").eq(last).addClass("info");
	searchBadgeWinners({badge:badgeName},true);
}

function modalShowAward(){
	if($(this).data("id"))
		modalShowAwardRaw(badgeObj[$(this).data("id")]);
	else{
		//Generate a temp badge container for it
		var badgeName=$(this).data("badge");
		var subject=$(this).data("subject");
		var date=$(this).data("date");
		var tmpBadgeObj=[{badge:badgeName,subject:subject,date:date}];
		modalShowAwardRaw(tmpBadgeObj);
	}
}

function modalShowBadgeWinners(){
	var badgeName=$(this).data("id");
	var badgeDetailed=badgeSearch(badgeName);
	$("#users-award-img").html(TAGb2(badgeName));
	addLightbox();
	$("#users-award-badgename").html(badgeDetailed[0][0]+badgeDetailed[1]);
	searchBadgeWinners({badge:badgeName},true);
}

function postshareSubjectCategoryChange(){
	var no=(this==window)?"0":$(this).val()-1;
	var selectAll=(no<0);
	for(var i=0;i<SUBJECT_CATEGORY_NAME.length;++i){
		switchVisible(".postshare-subject:eq("+i+")",selectAll||i==no);
		$(".postshare-subject").eq(i).attr("size",selectAll?1:12);
	}
		
}

function postshareCategoryChange(){
	var newValue=(this==window)?"share":$(this).val();
	switchVisible(".postshare-o1",newValue=="question");
	switchVisible(".postshare-o2",newValue!="scrapbook");
	switchVisible(".postshare-o3",newValue=="scrapbook");
	switchVisible(".postshare-o4",newValue!="watch");
	switchVisible(".postshare-o5",newValue=="watch");
	switchVisible(".postshare-o3.postshare-o5",newValue=="scrapbook"||newValue=="watch");
}

function changeSubjectSelection(){
	$("#postshare-subject-count").html($('.postshare-subject option:selected').length);
}

function selectAllSubjects(e){
	var newValue=$('.postshare-subject option:not(:selected)').length!=0;
	$('.postshare-subject option').prop('selected', newValue);
	changeSubjectSelection();
	e.preventDefault();
}