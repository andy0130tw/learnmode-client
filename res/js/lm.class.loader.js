//Implement LM loader for continueous loading data.
function LMLoader(){
	var self=this;

	self.respInfo=null;
	self.action="";
	self.lastReq=null;
	self.xhr=null;
	self.target=null;
	self.dummyContent="";

	self.clearBefore=false;
	//self.isRunning=false;

	self.preLoad=null;
	self.loadFunc=null;
	self.parse=null;
	self.render=null;

	

	var flush=function(resp){
		//pre-process item, allowing modification,
		//but no storaging to save memory.
		var lreq=self.lastReq;
		if(!lreq.sort&&lreq.after)resp.list.reverse();
		var data=self.parse(resp);
		//Grab info from response
		self.respInfo=resp.info;
		self.render(data);
	};

	self.load=function(action,param){
		self.clear();
		self.respInfo=null;
		self.action=action;
		self.lastReq=param;
		var toCont=self.preLoad();
		if(toCont){
			if(self.xhr)self.xhr.abort();
			self.xhr=self.loadFunc(action,param,flush);
		}
	};
	
	self.loadMore=function(){
		self.clearBefore=false;
		if(!self.respInfo)return;
		var lreq=self.lastReq;
		if(lreq.after){
			if(lreq.sort=="date")self.lastReq.after=self.respInfo.oldest;
			else self.lastReq.after=self.respInfo.newest;
		}
		else self.lastReq.before=self.respInfo.oldest;
		var toCont=self.preLoad();
		if(toCont){
			if(self.xhr)self.xhr.abort();
			xhr=self.loadFunc(self.action,self.lastReq,flush);
		}
	};

	self.clear=function(){
		if(self.target===null)throw new Error("LMLoader, no target to clear.");
		$('*[data-toggle="popover"]').popover('destroy');
		//Alt, brutal, no animation:
		//$(".popover").remove();
		if(!self.dummyContent)
			self.dummyContent=self.target.html();
		self.target.html(self.dummyContent);
		//self.clearBefore=false;
	};
}

var mainLoader=null;
$(function(){
	mainLoader=new LMLoader();
	mainLoader.loadFunc=loadFromLM;
	mainLoader.parse=parsePostListView;
	mainLoader.preLoad=function(){
		setShow("#main-loading","",false);
		$("#main-loading").html(getLoadingRing("center")+"<hr/>");
		viewRecognize(this.lastReq,this.clearBefore);
		if(this.lastReq.category=="__badge"){
			addToAward(currentProfile.badges);
			//Simulate finish
			setShow("#main-loading","",true);
			return false;
		}
		return true;
	};
	mainLoader.render=addToContent;
	mainLoader.target=$("#mainContent");
});


function parsePostListView(resp){
	var listArr=resp.list;
	var data=[];
	for (var x in listArr){
		var obj=modifyObj(listArr[x],resp);
		data.push(renderPostListView(obj));
	}
	if(!data.length)return false;
	return data.join("");
}

function parsePostThumbView(resp){
	var listArr=resp.list;
	var arr=[];
	for (var x in listArr){
		arr.push(renderPostImageView(modifyObj(listArr[x],resp)));
	}
	var data=processGrid(arr,4);
	return TAG("div","grid",data.join(""));
}

function addToContent(data){
	//console.log(this);
	var __st1=new Date();
	switchEnabled("#btn-loadmore",this.respInfo.more);
	this.target.append(data);
	if(data===false)this.target.append(listitemNull("沒有動態可顯示。"));
	$("#main-loading").empty();
	setShow("#main-loading","",true);
	//Add lightbox listener
	registerListUtil(this.target).registerAll();
	var __st2=new Date();
	console.log("[addToContent/Render] "+(__st2-__st1)+"ms");
}