/*!
Copyright:
Code related to formData was modified from ggt.tw
See: ggt.tw/learnmode
*/
function postShareForm(){
	var formData = new FormData();
	var ctrlFile=$("#postshare-file-image")[0];
	var app="com.htc.learnmode";
	//Check for images and url
	var category=$("#postshare-category").val();
	var url=String($("#postshare-url").val());
	var msg=$("#postshare-message").val();
	if(!msg&&confirm("要清空圖片欄位嗎？")){
		$("#postshare-form")[0].reset();
		return;
	}
	var __ADDURL=function(){
		formData.append("url",url);
		__ADDURL=null;
	}
	if(category=="scrapbook"){
		//v1.75 - bug fix, check for file api
		if(!ctrlFile.files){
			alert("噢噢，此環境下無法發送剪貼簿。");
			return;
		}else if(!ctrlFile.files[0]){
			alert("剪貼簿必須要有圖片才可發佈。");
			return;
		}	
		if(url){
			__ADDURL();
			app="com.android.browser";
		}
	} else if(category=="watch"){
		if(!url){
			alert("觀看影片必須要有影片網址，且目前只支援YouTube。");
			return;
		}else{
			var videoid="",videomatch=YOUTUBE_REGEX.exec(url);
			if(videomatch){
				videoid=videomatch[1];
			}else{
				var urlArr=url.split("/");
				videoid=urlArr[urlArr.length-1];
				var c=confirm("偵測到影片的ID為[ "+videoid+" ]，正確嗎？");
				if(!c)return;
			}
			formData.append("title",msg.split("\n")[0]);
			url="http://m.youtube.com/#/watch?v="+videoid;
			__ADDURL();
		}
		app="browser";
	}
	formData.append("device",storageObject.load("mac"));
	formData.append("message",$("#postshare-message").val());
	formData.append("application",app);
	formData.append("category",category);

	var subjects=$(".postshare-subject option:selected").map(function(){return this.value}).get();
	//Subjects will be auto processed in proxy.
	//if(!needSubject(category)||!subjects.length)//subjects=[10001,90006];
	if(!subjects.length){
		if(category=="watch")subjects=[10001,10004,30007];
	}
	formData=appendSubject(formData,subjects);
	
	if(ctrlFile.files&&ctrlFile.files[0])
		formData.append("image",ctrlFile.files[0]);
	
	setShow("#postshare-ok","#postshare-processing",true);
	postProxy("postNotify",formData,function(resp){
		modalHide();
		notify.complete({message:"貼文發佈成功！",status:resp?resp._status:{}});
		//清空表單
		$("#postshare-form")[0].reset();
		postshareCategoryChange();
		changeSubjectSelection();
		$("#btn-refresh").click();
	}); 
}

function postReplyForm(){
	var msg=$("#postreply-message").val();
	if(!msg&&confirm("要清空圖片欄位嗎？")){
		$("#postreply-form")[0].reset();
		return;
	}
	//close
	$("#popup-reply-accordion-content").collapse('hide');
	var formData = new FormData();
	formData.append("device",storageObject.load("mac"));
	formData.append("message",msg);
	formData.append("category",replyObject._replyBase.category);
	formData.append("application",replyObject._replyBase.application);
	formData.append("related",replyObject.id);
	formData=appendSubject(formData,extractSubject(replyObject.subjects));
	var ctrlFile=$("#postreply-file-image")[0];
	//v1.75 - small refactoring
	var fileRef;
	if(ctrlFile.files&&(fileRef=ctrlFile.files[0]))
		if(replyObject._replyBase.allowImage)
			formData.append("image",fileRef);
	postProxy("postNotify",formData,function(resp){
		notify.complete({message:"回應發佈成功！",status:resp._status});
		//clear the form
		$("#postreply-form")[0].reset();
		refreshReply();
	}); 
}

function appendSubject(formData,subjectArr){
	for(var i=0;i<subjectArr.length;++i)
		formData.append("subject[]",subjectArr[i]);
	return formData;
}

function postMood(num){
	var formData = new FormData();
	formData.append("device",storageObject.load("mac"));
	formData.append("mood",num);
	formData.append("id",replyObject.id);
	postProxy("postMood",formData,function(resp){
		var msg=resp.message=="0"?"清除表情或未變動":("甩了一個 [ "+HASH.mood[resp.message]+" ]");
			notify.info(msg+"！");
		getDetailedPost({id:replyObject.id},true);
	});
}

function postVote(str,id,callback){
	assert(id,"postVote","id is missing.");
	var formData = new FormData();
	formData.append("device",storageObject.load("mac"));
	formData.append("vote",str);
	formData.append("id",id);
	postProxy("postVote",formData,function(resp){
		var result=resp.message;
		var msg={up:ICON("thumbs-up"),down:ICON("thumbs-down"),clear:"清除評分"};
		notify.info("評了一個"+msg[result]+"！<br/>評分分數要重新整理後才會更新。");
		callback(resp);
	});
}

function postIfFollow(userID,yesno){
	var formData = new FormData();
	formData.append("device",storageObject.load("mac"));
	formData.append("user",userID);
	if(yesno)postFollow(formData,userID);
		else postUnfollow(formData,userID);
}

function postFollow(data,userID){
	postProxy("followUser",data,function(resp){
		notify.info("成功關注！");
		readUserProfile({user:userID});
	});
}
function postUnfollow(data,userID){
	postProxy("unfollowUser",data,function(resp){
		notify.info("成功解除關注！");
		readUserProfile({user:userID});
	});
}


function BLOCK_CAUTION_MAKER(user,yesno){
	if(typeof yesno=="undefined"){
		alert("Syntax: postIfBlock(a,b), \n a is ignored, and b is your decision.");
		return false;
	}
	var _tmp_="這是一個本網頁的實驗功能，\n"+
		"可以利用這個函式來封鎖/解除封鎖某人。\n"+
		"進入該人的大聲公之後呼叫此函式即可。\n\n";
	if(isMyself(user)){
		alert(_tmp_+"你想對你自己做什麼？");
		return false;
	}
	return confirm(_tmp_+"你想要"+
		(yesno?"":"解除")+"封鎖 "+user.name+" 嗎？");
}

function postIfBlock(user,yesno){
	if(!BLOCK_CAUTION_MAKER(currentProfile,yesno))return;
	var formData = new FormData();
	//v1.76 - unified id
	var userID=UID(currentProfile);
	formData.append("device",storageObject.load("mac"));
	formData.append("user",userID);
	(yesno?postBlock:postUnblock)(formData,userID);
}

function postBlock(data,userID){
	postProxy("blockUser",data,function(resp){
		notify.info("成功封鎖！");
		readUserProfile({user:userID});
	});
}
function postUnblock(data,userID){
	postProxy("unblockUser",data,function(resp){
		notify.info("成功解除封鎖！");
		readUserProfile({user:userID});
	});
}

function postSavePinList(){
	var formData=new FormData();
	var newPinList={};
	for(var x in pinList){
		if(pinList[x])
			newPinList[x]=pinList[x];
	}
	pinList=newPinList;
	formData.append("data",JSON.stringify(pinList));
	postUserdata("save",formData,function(resp){
		if(resp)
			console.log("[postSavePinList] sync status="+resp.content);
	});
}