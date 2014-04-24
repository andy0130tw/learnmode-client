//Extended version of modal

function modalNavigate(instance,isModal,needZoom){
	modal(instance,isModal,needZoom,{
		callbacks:{
			close:function(){
				try{
					location.hash="#!";
					history.replaceState(null,"",
						window.location.pathname+window.location.search);
				}catch(err){	
					//location.hash="#!";
				}
				
			}
		}
	});
}

function getURLParamObject(searchStr){
	var match,
		pl     = /\+/g,  // Regex for replacing addition symbol with a space
		search = /([^&=]+)=?([^&]*)/g,
		decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
		query  = searchStr.substring(1);
	var rtn = {};
	while (match = search.exec(query))
	   rtn[decode(match[1])] = decode(match[2]);
	return rtn;
}

function initHashRoutes(){
	
	var currentModalIsNotFound=function(){
		var cm=currentModal();
		return cm&&cm.data.src[0].id!="popup-notfound";
	}

	var showNotFound=function(cur){
		//if(currentModalIsNotFound())return;
		modal("#popup-notfound",false,true);
		$("#popup-notfound").find("code.fill-hash").html(cur.current);
	}

	var hideNotFound=function(){
		if(currentModalIsNotFound())modalHide();
	}

	var processRestArg=function(arg){
		//var obj=getURLParamObject(arg);
		//var img=obj["image"];
		//if(img)
		//	$(function(){Shadowbox.open({content:img,player:"img",title:"External Image"});});
	}

	var debug=function(type){
		console.log("[HASH] interpreted",type,this.params);
	}

	var hashBodyIsChanged=function(){
		if(!Path.routes.previous)return true;
		var x=Path.routes.previous.split("?");
		var y=location.hash.split("?");
		return !(x[0].replaceAll("/","")==y[0].replaceAll("/",""));
	}

	var postMapHandler=function(){
		var id=this.params['id'];
		var query=this.params['restArg'];
		if(!hashBodyIsChanged(query))return;
		modalNavigate("#popup-reply",false,false);
		clrReplyPopup(true);
		$("#postreply-id").val(id);
		getDetailedPost({id:id});

		if(query)processRestArg(query);
		debug.call(this,"post");
	}

	Path.rescue(function(){
		if(!this.current||this.current=="#!"){
			hideNotFound();
			return;
		}
		showNotFound(this);
		console.log("[Path/rescue] not found.");
	});
	
	Path.map("#!/post(/:id)/").to(postMapHandler);
	Path.map("#!/post(/:id)(/:restArg)").to(postMapHandler);

	/*Path.map("#/:arg1(/:arg2)").to(function(){
		//var action=this.params['arg1'];
		//var id=this.params['arg2'];
		console.log("HASH interpreted 1: ",this.params);
	});*/

	/*Path.map("#/:arg1(/:RestArg)").to(function(){
		console.log("HASH interpreted 2: ",this.params);
	});*/
	
	Path.listen();
}