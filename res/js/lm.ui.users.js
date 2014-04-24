function searchUser(param,clearbefore){
	param.count=COUNT.USER_SEARCH;
	if(clearbefore)clrUsersPopup();
	switchVisible("#users-award",false);
	loadFromLM("profile/search",param,addToUsersPopup);
	return param;
}
function searchFollowing(param,clearbefore){
	param=param||{};
	if(clearbefore)clrUsersPopup();
	switchVisible("#users-award",false);
	param.count=COUNT.USER;
	param.user=currentProfile.username;
	loadFromLM("following",param,addToUsersPopup);
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
	return param;
}

function loadMoreUsers(){
	usersMoreFN({before:lastestUsersID});
}

function searchUserSubmit(e){
	e.preventDefault();
	var param={q:$('#users-searchbox').val()};
	lastestUsersID="";
	searchUser(param,true);
	usersMoreFN=searchUser;
}