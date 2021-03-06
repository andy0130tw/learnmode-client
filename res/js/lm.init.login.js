﻿var myProfile={};
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
	$("#welcome-mac").html(storageObject.load("mac"));
	if(!storageObject.load("mac")){
		modal("#popup-login",true,true);
		return;
	}
	if(isLocalStorageSupported()){
		var tmp;
		if(tmp=localStorage.getItem("identity")){
			try{
				myProfile=JSON.parse(tmp);
				fillIdentity();
				if(!GIVE_UP_LOADING)viewLoad({});
				console.log("[doLogin] Cached identity discovered. Use it.");
			}catch(err){
				localStorage.removeItem("identity");
				console.log("[doLogin] Corrupted user data. Cleared.");
			}
		}
	}
	
	readProfile();
	getPinList();
	
	if(!URL_PROXY)
		$("#welcome-hst").addClass("error").html("[N/A]");
	else 
		loadFromProxy("did_login",{did:storageObject.load("mac")},function(resp){
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
	storageObject.save("mac",$("#login-mac").html());
	location.reload();
}

//v1.63 - fill view to skip loading identity
function fillIdentity(){
	assert(myProfile,"fillIdentity");
	//v1.76 - unified id
	$("#accountBtn").data("id",UID(myProfile));
	$(".action-account").data("id",UID(myProfile));
	$(".fill-username").html(myProfile.name);
	$("#btn-user-img").attr("src",imageLM(myProfile.image));
	//executing twice is okay!
	//fillIdentity=function(){};
}

function doLogin(resp){
	var __first=!(myProfile=={});
	myProfile=resp.profile;
	currentProfile=myProfile;
	if(!__first)return;

	//welcome message
	$("#welcome-mac").addClass("success");
	$("#welcome-msg").html("Hello, "+myProfile.name+" ("+myProfile.username+")");
	$("#welcome-img").attr("src",imageLM(myProfile.image));
	$("#welcome-school").html(myProfile.school);
	fillIdentity();

	//Backup identity
	if(isLocalStorageSupported()){
		if(!localStorage.getItem("identity"))
			if(!GIVE_UP_LOADING)viewLoad({});
		localStorage.setItem("identity",JSON.stringify(resp.profile));
	}else{
		if(!GIVE_UP_LOADING)viewLoad({});
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
	var macVal=$("#login-input-mac").val();
	var hdl=$("#login-mac");
	if(macVal.indexOf("!")==0){
		macVal=macVal.substr(1);
		if(macVal)
			hdl.removeClass("text-muted").html(macVal);
		else
			hdl.addClass("text-muted").html("** 萬用模式 **");
		return !!macVal;
	}else{
		var macobj=macConverter(macVal);
		hdl.html(macobj.mac);
		if(macobj.valid){
			hdl.removeClass("text-muted");
		}else{
			hdl.append(" [無效]")
				.addClass("text-muted");
		}
		return macobj.valid;
	}
		
}

function confirmClearMAC(){
	if(storageObject.load("mac")){
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
	storageObject.remove("mac");
	localStorage.removeItem("identity");
}