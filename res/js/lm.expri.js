function experimental(num){
	if(num==1){
		var arr=["share","question","scrapbook","comment","watch"];
		for (var i = arr.length - 1; i >= 0; i--) {
			RENDER_ENG.category1[arr[i]].reactFN=renderVoteButton;
		};
		
		alert("強制玄奇樓已設置。網頁重新整理後會失效。");
	}else if(num==2){
		postIfBlock(0,1);
	}else if(num==3){
		postIfBlock(0,0);
	}else if(num==4){
		var x=window.USE_MOBILE_RULE=!window.USE_MOBILE_RULE;
		localStorage.setItem("use-mobile",x?"true":"");
		alert("嘗試使用平板簡易模式：現在起"
			+(x?"啟用":"停用")
			+"。\n網頁重新整理不會失效，若要取消請重新選用此項。");
	}else{
		alert("無效的實驗功能！");
	}
	return false;
}