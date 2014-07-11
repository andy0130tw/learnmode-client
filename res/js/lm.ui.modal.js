function openPostShareForm(){
	setShow("#postshare-ok","#postshare-processing",false);
	modal("#popup-postshare",false,true);
}
function openNewsForm(){
	modal("#popup-news",false,true);
}

function showFollowerPopup(){
	showUsersPopup((isMyself(currentProfile)?"":currentProfile.name+" 的 ")+"粉絲團 ("+currentProfile.followers_count+")");
	clrUsersPopup();
	switchVisible("#users-search",false);
	searchFollower(null,true);
	usersMoreFN=searchFollower;
}

function showFollowingPopup(){
	showUsersPopup((isMyself(currentProfile)?"":currentProfile.name+" 的 ")+"我關注 ("+currentProfile.following_count+")");
	clrUsersPopup();
	switchVisible("#users-search",false);
	searchFollowing(null,true);
	usersMoreFN=searchFollowing;
}

function showUsersPopup(title){
	modal("#popup-users");
	setShow("#users-loading","#users-ok",false);
	if(usersMoreFN!=searchUser)clrUsersPopup();

	//switchEnabled("#btn-loadmore-users",false);
	$("#popup-users").find("h3:eq(0)").html(title);
}

var shadowboxBadgeImageOption={
	onOpen:function(){
		$("#sb-body").addClass("white");
	},
	onClose:function(){
		$("#sb-body").removeClass("white");
	}
};

function modalShowAwardRaw(badgeList){
	showUsersPopup("獎牌");
	clrUsersPopup();
	switchVisible("#users-search",false);
	switchVisible("#users-award",true);
	//Deferred loading process
	setShow("#users-loading","#users-ok",true);
	var badgeName=badgeList[badgeList.length-1].badge;
	var badgeDetailed=badgeSearch(badgeName);
	var badgeSubject=SUBJECT_MAP[badgeList[0].subject]||"";

	var ctrl=$("#users-award-img");
	ctrl.html(TAGb2(badgeName));
	registerListUtil(ctrl).setupLightbox(shadowboxBadgeImageOption);
	$("#users-award-info > [data-field='name']").html(badgeDetailed[0][0]+badgeDetailed[1]);
	$("#users-award-info > [data-field='subject']").html(badgeSubject);
	$("#users-award-desc1").html(badgeDetailed[0][1][0].replaceAll("|","<br/>"));
	$("#users-award-desc2").html(badgeDetailed[0][1][1].replaceAll("|","<br/>"));

	var awardList=$(".users-award");
	awardList.removeClass("info");
	
	//Transfer data
	var badgeObj=new Array(3);
	for(var i=0;i<badgeList.length;++i){
		var o=badgeOrder(badgeList[i].badge);
		badgeObj[o]=badgeList[i];
	}
	var last=0;
	for(var i=0;i<3;++i){
		var container=awardList.eq(i).children("td");
		container.eq(1).html(badgeDetailed[0][2][i]);
		if(badgeObj[i]){
			var nowBadge=badgeObj[i].badge;
			last=i;
			container.eq(2).html(dateConverter(badgeObj[i].date,true));
			container.eq(3).html(renderButtonRaw("觀看","success action-badgewinner",nowBadge));
		}else{
			container.eq(2).html("...");
			container.eq(3).html("...");
		}
	}
	awardList.eq(last).addClass("info");
	searchBadgeWinners({badge:badgeName},true);
}

function modalShowAward(){
	var data=$(this).data();
	if(data.id)
		modalShowAwardRaw(badgeObj[data.id]);
	else{
		//Generate a temp badge container for it
		var badgeName=data.badge;
		var subject=data.subject;
		var date=data.date;
		var tmpBadgeObj=[{badge:badgeName,subject:subject,date:date}];
		modalShowAwardRaw(tmpBadgeObj);
	}
}

function modalShowBadgeWinners(){
	var data=$(this).data();
	var badgeName=data.id;
	var badgeSubject=data.subject;
	var badgeDetailed=badgeSearch(badgeName);
	var ctrl=$("#users-award-img");
	ctrl.html(TAGb2(badgeName));
	registerListUtil(ctrl).setupLightbox(shadowboxBadgeImageOption);
	$("#users-award-info > [data-field='name']").html(badgeDetailed[0][0]+badgeDetailed[1]);
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
	var val=(this==window)?"share":$(this).val();
	switchVisible("#postshare-o-subject",val=="question"||val=="watch");
	switchVisible("#postshare-o-image-rect",val=="scrapbook");
	switchVisible("#postshare-o-image-rect-no",val!="scrapbook");
	switchVisible("#postshare-o-url",val=="scrapbook"||val=="watch");
	switchVisible("#postshare-o-url-scrap",val=="scrapbook");
	switchVisible("#postshare-o-url-video",val=="watch");
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