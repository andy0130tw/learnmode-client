function searchUser(param,clearbefore){
	param.count=COUNT.USER_SEARCH;
	if(clearbefore)clrUsersPopup();
	switchVisible("#users-award",false);
	$("#users-body-loading").html(getLoadingRing("center"));
	setShow("#users-body-loading","",false);
	lastestUsersReq=loadFromLM("profile/search",param,addToUsersPopup);
	usersMoreFN._param=param;
	return param;
}
function searchFollowing(param,clearbefore){
	param=param||{};
	if(clearbefore)clrUsersPopup();
	switchVisible("#users-award",false);
	param.count=COUNT.USER;
	param.user=currentProfile.username;
	lastestUsersReq=loadFromLM("following",param,addToUsersPopup);
	return param;
}
function searchFollower(param,clearbefore){
	param=param||{};
	if(clearbefore)clrUsersPopup();
	switchVisible("#users-award",false);
	param.count=COUNT.USER;
	param.user=currentProfile.username;
	lastestUsersReq=loadFromLM("followers",param,addToUsersPopup);
	return param;
}
function searchBadgeWinners(param,clearbefore){
	param=param||{};
	if(clearbefore)clrUsersPopup();
	param.count=COUNT.USER_BADGE;
	lastestUsersReq=loadFromLM("badge/winners",param,addToUsersPopup);
	usersMoreFN=searchBadgeWinners;
	usersMoreFN._param=param;
	return param;
}

function loadMoreUsers(){
	$("#users-body-loading").html(getLoadingRing("center"));
	setShow("#users-body-loading","",false);
	var param={before:lastestUsersID};
	var oldParam=usersMoreFN._param;	
	if(oldParam)param=$.extend(true,param,oldParam);
	usersMoreFN(param);
}

function searchUserSubmit(e){
	e.preventDefault();
	var param={q:encodeURIComponent($('#users-searchbox').val())};
	lastestUsersID="";
	searchUser(param,true);
	usersMoreFN=searchUser;
}