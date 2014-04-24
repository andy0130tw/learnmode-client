var myProfile={};
var SKIP_SPLASH=0;
var GIVE_UP_LOADING=0;
var FREEZE=0;

function initLogin(){
	//Overwrite SKIP_SPLASH if necessary.
	//if(Path.routes.current)
	if(location.hash!=""&&location.hash!="#!")
		SKIP_SPLASH=true;

	//if mac is found, try to login
	if(!SKIP_SPLASH){
		modal("#popup-welcome",true,true);
		splashNeedClose=true;
	}
	$("#welcome-mac").html(cookieObject.load("mac"));
	if(!cookieObject.load("mac")){
		modal("#popup-login",true,true);
		return;
	}
	if(typeof localStorage!="undefined")
		var tmp;
		if(tmp=localStorage.getItem("identity")){
			myProfile=JSON.parse(tmp);
			try{
				if(!GIVE_UP_LOADING)viewLoad({});
				console.log("[doLogin] Cached identity discovered. Use it.");
			}catch(err){
				localStorage.removeItem("identity");
				console.log("[doLogin] Corrupted user data. Cleared.");
			}
		}

	readProfile();
	getPinList();
	
	if(!URL_PROXY)
		$("#welcome-hst").addClass("error").html("[N/A]");
	else 
		loadFromProxy("did_login",{did:cookieObject.load("mac")},function(resp){
			$("#welcome-hst").addClass("success").html("[200 OK]");
		});

	//Add Hash
	
}


//b13dev
function relogin(){
	if(!checkMAC()){
		alert("MAC無效，無法登入。");
		return;
	}
	$.cookie("mac",$("#login-mac").html(),{expires:365});
	location.reload();
}

function doLogin(resp){
	var __first=!(myProfile=={});
	myProfile=resp.profile;
	currentProfile=myProfile;
	if(!__first)return;
	$("#welcome-mac").addClass("success");
	$("#welcome-msg").html("Hello, "+myProfile.name+" ("+myProfile.username+")");
	$("#welcome-img").attr("src",imageLM(myProfile.image));
	$("#welcome-school").html(myProfile.school);
	$("#accountBtn").data("id",myProfile.username);
	$(".action-account").data("id",myProfile.username);
	$(".fill-username").html(myProfile.name);
	$("#btn-user-img").attr("src",imageLM(myProfile.image));
	
	//Backup identity
	if(typeof localStorage!="undefined"){
		if(!localStorage.getItem("identity"))
			if(!GIVE_UP_LOADING)viewLoad({});
		localStorage.setItem("identity",JSON.stringify(resp.profile));
	}

	$("#welcome-hint").css("opacity",1);

	if(!SKIP_SPLASH)setTimeout(function(){
		if(splashNeedClose)modalHide();
	},SPLASH_OFF_DURATION);
}

function doLoginFailure(resp){
	$("#welcome-msg").html("Login Failed!");
	$("#welcome-mac").addClass("error");
	var re=confirm("登入失敗...\n要清除掉MAC然後重新嘗試嗎？");
	if(re){
		clearClientData();
		location.reload();
	}
}

function checkMAC(){
	var macobj=macConverter($("#login-input-mac").val());
	$("#login-mac").html(macobj.mac);
	if(macobj.valid){
		$("#login-mac").removeClass("text-muted");
	}else{
		$("#login-mac").append(" [無效]");
		$("#login-mac").addClass("text-muted");
	}
	return macobj.valid;
}

function confirmClearMAC(){
	if(cookieObject.load("mac")){
		ans=confirm("即將從 LMClient 登出，確定？");
		if(ans){
			clearClientData();
			alert("登出成功。\n謝謝您的使用，歡迎再度光臨。");
			location.reload();
		}else return;
	}
}

function fillMAC(){
	if($(this).hasClass("void"))return;
	if($(this).hasClass("backspace")){
		var val=$("#login-input-mac")[0].value;
		$("#login-input-mac")[0].value=val.substr(0,val.length-1);
	}else{
		if(!checkMAC())
			$("#login-input-mac")[0].value+=$(this).html();
	}
	checkMAC();
}

function clearClientData(){
	var items=$.cookie();
	for(var x in items)$.removeCookie(x);
	localStorage.removeItem("identity");
}