function loadMoreUsers(){
	$("#users-body-loading").html(getLoadingRing("center"));
	setShow("#users-body-loading","",false);
	usersMoreFN();
}

function searchUser(param,clearbefore){
	param=param||usersMoreFN._param||{};
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
	param=param||usersMoreFN._param||{};
	if(clearbefore)clrUsersPopup();
	switchVisible("#users-award",false);
	param.count=COUNT.USER;
	param.user=currentProfile.username;
	lastestUsersReq=loadFromLM("following",param,addToUsersPopup);
	usersMoreFN._param=param;
	return param;
}
function searchFollower(param,clearbefore){
	param=param||usersMoreFN._param||{};
	if(clearbefore)clrUsersPopup();
	switchVisible("#users-award",false);
	param.count=COUNT.USER;
	param.user=currentProfile.username;
	lastestUsersReq=loadFromLM("followers",param,addToUsersPopup);
	usersMoreFN._param=param;
	return param;
}
function searchBadgeWinners(param,clearbefore){
	param=param||usersMoreFN._param||{};
	if(clearbefore)clrUsersPopup();
	param.count=COUNT.USER_BADGE;
	lastestUsersReq=loadFromLM("badge/winners",param,addToUsersPopup);
	usersMoreFN=searchBadgeWinners;
	usersMoreFN._param=param;
	return param;
}

function searchUserSubmit(e){
	e.preventDefault();
	var param={q:encodeURIComponent($('#users-searchbox').val())};
	usersMoreFN=searchUser;
	searchUser(param,true);
}