notify={
	connectFailure:function(content,time){
		$.Notify({caption:ICON("cancel")+" 連線失敗!",content:content+"<br/>請手動按鈕重新整理對應內容. ",style:{background:"rgb(255,45,25)",color:"white"},timeout:time||NOTIFY_TIME.MEDIUM});
	},
	abort:function(content,time){
		$.Notify({caption:ICON("cycle")+" 重新連線. ",content:content,style:{background:"white",color:"rgb(51,51,51)"},timeout:time||NOTIFY_TIME.SHORT});
	},
	verbose:function(content,time){
		$.Notify({caption:ICON("console")+" 除錯.",content:content,style:{background:"white",color:"rgb(51,51,51)"},timeout:time||NOTIFY_TIME.MEDIUM});
	},
	warning:function(content,time){
		$.Notify({caption:ICON("console")+" 注意!",content:content,style:{background:"rgb(255,220,0)",color:"rgb(51,51,51)"},timeout:time||NOTIFY_TIME.LONG});
	},
	error:function(content,time){
		$.Notify({caption:ICON("cancel")+" 錯誤!",content:content,style:{background:"rgb(170,0,0)",color:"white"},timeout:time||NOTIFY_TIME.MEDIUM});
	},
	complete:function(content,time){
		$.Notify({caption:ICON("checkmark")+" 完成!",
			content:content.message+"<br/>"+notifyStatusRenderer(content.status)
			,style:{background:"rgb(0,138,0)",color:"white"},timeout:time||NOTIFY_TIME.MEDIUM});
	},
	info:function(content,time){
		$.Notify({caption:ICON("star-3")+" 成功!",content:content,style:{background:"rgb(27,161,226)",color:"white"},timeout:time||NOTIFY_TIME.MEDIUM});
	},
	update:function(content,time){
		if(content.once){
			$.Notify({caption:ICON("flag-2")+" 共有 "+content.count+" 個追蹤貼文更新了! ",
			content:"在主畫面點開追蹤列表查看! ",
			style:{background:"rgb(27,161,226)",color:"white"},timeout:time||NOTIFY_TIME.LONG});
			return;
		}

		$.Notify({caption:ICON("flag-2")+" 追蹤貼文有 "+content.count+" 個更新! ",
			content:content.message+"<br/>點擊此處查看! "+TAG("span","","data-id='"+content.id+"'",""),
			style:{background:"rgb(27,161,226)",color:"white"},timeout:time||NOTIFY_TIME.LONG});
		$(".notify-container span[data-id='"+content.id+"']").parent().parent().data("id",content.id).click(modalShowReply);
	}
}

function notifyStatusRenderer(statusObj){
	if(!statusObj||!statusObj.http_code)return "";
	return "花費時間："+roundTo(statusObj.total_time,2)+" sec<br/>"
	+"大小 (↑/↓)："+roundTo(statusObj.size_upload/1e3,3)+" / "+roundTo(statusObj.size_download/1e3,3)+" KB<br/>"
	+"速度 (↑/↓)："+roundTo(statusObj.speed_upload/1e3,3)+" / "+roundTo(statusObj.speed_download/1e3,3)+" KB/sec";
}
