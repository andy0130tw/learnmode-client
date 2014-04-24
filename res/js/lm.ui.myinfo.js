var myInfoCount=0;

function modalMyInfo(){
	if(!myProfile)throw new Error("myProfile is not ready to be used!");
	setShow("#myinfo-processing","#myinfo-ok",true);
	modal("#popup-myinfo",false,true);
	//fill in user data
	$("#myinfo-name").val(myProfile.name);
	$("#myinfo-username").val(myProfile.username);
	$("#myinfo-email").val(myProfile.email);
	$("#myinfo-web").val(myProfile.web);
	$("#myinfo-location").val(myProfile.location);
	$("#myinfo-build_number").val(myProfile.build_number);
	$("#myinfo-desc").val(myProfile.desc);
}

function postMyInfoForm(){
	setShow("#myinfo-processing","#myinfo-ok",false);
	var formData=addFormDataIfChanged(["name","username","email","web","build_number","location","desc"],"#myinfo-");
	if(formData){
		myInfoCount++;
		postProxy("updateProfile",formData,myInfoSuccess);
	}
	postMyInfoImage($("#myinfo-file-image")[0],"image");
	postMyInfoImage($("#myinfo-file-cover")[0],"cover");
	if(!formData&&myInfoCount==0){
		checkMyInfo(true);
	}
}

function postMyInfoImage(imageCtrlFile,dataName){
	if(imageCtrlFile.files&&imageCtrlFile.files[0]){
		myInfoCount++;
		var formData=new FormData();
		formData.append("device", cookieObject.load("mac"));
		formData.append(dataName,imageCtrlFile.files[0]);
		postProxy("uploadProfileImage",formData,myInfoSuccess);
	}
}

function myInfoSuccess(resp){
	myInfoCount--;
	if(myInfoCount)notify.info("成功上傳！"+"(剩餘"+myInfoCount+"個上傳作業)");
	else checkMyInfo();
}

function checkMyInfo(notChanged){
	if(myInfoCount!=0)return;
	readProfile();
	notify.complete({message:notChanged?"個人資料並未更動。":"成功修改個人資料！"});
	modalHide();
}

//Util
function addFormDataIfChanged(arr,prefix){
	var formData = new FormData(),needReturn=false;
	formData.append("device",cookieObject.load("mac"));
	for(var i=0;i<arr.length;++i){
		var oldData=myProfile[arr[i]];
		var newData=$(prefix+arr[i]).val();
		if(oldData!=newData){
			console.log("[addFormDataIfChanged] changed id="+arr[i]);
			formData.append(arr[i],newData);
			needReturn=true;
		}
	}
	return needReturn?formData:null;
}
