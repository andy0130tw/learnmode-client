function navBtnListeners(){
	$("#allActivity").click(function(){
		navClick();
		viewLoad({sort:"date"},true);
	});
	$("#myActivity").click(function(){
		navClick();
		viewLoad({},true);
		currentProfile=myProfile;
	});
	$("#myActivity2").click(function(){
		navClick();
		viewLoad({user:myProfile.username,sort:"date"},true);
		currentProfile=myProfile;
	});

	/*$("#shh").click(function(){
		navClick();
		viewLoad({category:"share",sort:"score"},true);
	});
	$("#shhk").click(function(){
		navClick();
		viewLoad({category:"share"},true);
	});
	$("#shh2").click(function(){
		navClick();
		viewLoad({category:"question",sort:"score"},true);
	});
	$("#shh2k").click(function(){
		navClick();
		viewLoad({category:"question"},true);
	});
	$("#shh2u").click(function(){
		navClick();
		viewLoad({category:"question",unanswered:true,sort:"date"},true);
	});
	$("#shh4").click(function(){
		navClick();
		viewLoad({category:"scrapbook",sort:"score"},true);
	});
	$("#shh4k").click(function(){
		navClick();
		viewLoad({category:"scrapbook"},true);
	});*/
	$("#shh5").click(function(){
		navClick();
		viewLoad({category:"!badge",sort:"date"},true);
	});

	$("#shh3").click(function(){
		navClick();
		listAnnouncement({count:COUNT.ANNOUNCEMENT},true);
		modal("#popup-announcement");
		setShow("#announcement-loading","",false);
	});
	$("#action-search").click(function(){
		navClick();
		showUsersPopup("搜尋使用者");
		setShow("#users-loading","#users-ok",true);
		switchVisible("#users-search",true);
		switchVisible("#users-award",false);
	});
	$("#nav-myfollow").click(function(){
		mainLoader.lastReq=deleteProp(deleteProp(mainLoader.lastReq,"user"),"sort");
		viewLoad(mainLoader.lastReq,true);
	});
	$("#nav-new").click(function(){
		mainLoader.lastReq=deleteProp(mainLoader.lastReq,"user");
		viewLoadMerge({sort:"date",before:null},true);
	});
	$("#nav-hot").click(function(){
		mainLoader.lastReq=deleteProp(mainLoader.lastReq,"user");
		viewLoadMerge({sort:"score",before:null},true);
	});
	$("#nav-unanswered").click(function(){
		if(mainLoader.lastReq.unanswered)viewLoad(deleteProp(mainLoader.lastReq,"unanswered"),true)
		else viewLoadMerge({unanswered:true,sort:"date",before:null},true);
	});
	$("#nav-album").click(function(){
		var param={category:"scrapbook"};
		//If user is not defined, put my id
		param.user=mainLoader.lastReq.user||myProfile.username;
		viewLoadMerge(param,true,parsePostThumbView/*listProfileThumb*/);
	});
	$("#nav-award").click(function(){
		//We don't need any arg to do this
		//Though this func is placed in get.
		if(mainLoader.lastReq.category=="__badge")
			viewLoad(deleteProp(mainLoader.lastReq,"category"),true);
		else {
			/*viewRecognize({category:"__badge"});
			mainLoader.lastReq.category="__badge";
			mainLoader.clear();
			addToAward(currentProfile.badges);*/

			viewLoadMerge({category:"__badge"},true);
		}
			
			//viewLoadMerge({category:"__badge"},true,listAward);
	});
	$(".action-sel").click(function(){
		var category=$(this).data("category");
		if(category!="all"){
			viewLoadMerge({category:category},true);
		}else{
			mainLoader.lastReq=deleteProp(mainLoader.lastReq,"category");
			viewLoad(mainLoader.lastReq,true);
		}
	});
	$(".action-sel-em").click(function(){
		var data=$(this).data();
		var sort=data["sort"]||null;
		viewLoad({category:data["category"],sort:sort,before:null},true);
	});
}


function switchNavByType(type){
	switchVisible("nav .questionmenu",type=="question");
	switchVisible("nav .usermenu",type=="user"||type=="homepage"||type=="__badge");
	switchVisible("nav .nohomemenu",type=="user");
	switchVisible("nav .categorymenu",
		type=="question"||type=="share"||type=="scrapbook"||
		type=="comment"||type=="answer"||type=="watch"||
		type=="practice"||type=="annotation"||type=="course");
	switchVisible("nav .hotmenu",
		type=="question"||type=="share"||type=="scrapbook"||
		type=="answer");
}

function navUpdate(param){
	$("nav")
		.find(".categorymenu,.questionmenu,.usermenu,.hotmenu")
		.find("a").removeClass("text-muted").removeClass("text-success");

	var linkname=[];
	if(param.unanswered){
		linkname.push("#nav-unanswered");
	}
	if(param.category=="scrapbook")linkname.push("#nav-album");
	if(param.category=="__badge")linkname.push("#nav-award");
	
	switchVisible("#nav-hot",!param.unanswered);
	switchVisible("#nav-myfollow,#nav-myself",param.category);
	
	if(param.user==myProfile.uid||param.user==myProfile.username)linkname.push("#nav-myself");
	else{
		if(param.sort=="score")linkname.push("#nav-hot");
		else if(param.sort=="date")linkname.push("#nav-new");
		else linkname.push("#nav-myfollow");
	}
	
	$(linkname.join(",")).removeClass("text-muted").addClass("text-success");
}