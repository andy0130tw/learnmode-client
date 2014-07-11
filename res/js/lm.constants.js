var VERSION_MAJOR="1.";
var VERSION_MINOR="64";
var VERSION_COUNT="";
var LAST_MODIFY="2014/7/11";

var LOCAL_TEST=(location.hostname=="localhost");
var DEBUGGING_ENVIROMENT=(!location.hostname);

var URL_PROXY=
	DEBUGGING_ENVIROMENT?"":
		(LOCAL_TEST?"proxy.php":"http://andy0130tw.qov.tw/proxy.php");
var URL_USERDATA=
	DEBUGGING_ENVIROMENT?"":
		(LOCAL_TEST?"":"http://andy0130tw.qov.tw/userdata.php");

var URL_LM="https://apollo.omcompany.com:5443/api/";
var URL_IMAGE="https://apollo.omcompany.com:5443/image/";
var URL_HST="http://lmadmin.learnmode.net/api/v1/";
var URL_SEARCH="https://mercury.omcompany.com:5443/";

var URL_BADGE_BASE="res/image/badge/";

var SPLASH_OFF_DURATION=2500;
var FX_VIEW_DURATION=1000;
var FX_BRING_TOP_DURATION=400;
var FX_POPOVER_SHOW_DELAY=200;
var FX_POPOVER_HIDE_DELAY=1200;

var FX_SHADOWBOX_FADE_DURATION=.25;
var FX_SHADOWBOX_RESIZE_DURATION=.3;

var SHADOWBOX_DEFAULT_OPTION={
		skipSetup:true,
		viewportPadding:24,
		displayNav:false,
		resizeDuration:FX_SHADOWBOX_RESIZE_DURATION,
		fadeDuration:FX_SHADOWBOX_FADE_DURATION,
		initialHeight:120,
		initialWidth:120,
		overlayOpacity: .3
};

//used in expri of v1.47
var OLDEST_TIMESTAMP="T0001F681040000";

var NOTIFY_TIME={
	SHORT:3e3,
	MEDIUM:7e3,
	LONG:1e4
};

var YOUTUBE_REGEX=/v=([\w\-]*).*/i;

var COUNT={
	HOMEPAGE:40,
	//HOMEPAGE_MORE:40,
	NOTIFICATION:50,
	REPLY:25,
	//NOTIFICATION_MORE:50,
	HOT:100,
	//HOT_MORE:100,
	ANNOUNCEMENT:10,
	USER:30,
	USER_SEARCH:20,
	USER_BADGE:10,
	MOOD:30,
	VOTER:30,
	ALBUM:24,
	PIN:3
};

var COLOR_CLASS={
	APPLICATION:"text-muted list-small",
	CATEGORY:"text-info item-title-secondary",
	SCHOOL:"text-muted list-small",
	VOTE:"fg-amber",
	EMOTION:"fg-pink",
	FOLLOW:"text-success",
	BADGE:"text-warning",
	
	VOTE_BD:"bd-amber",
	EMOTION_BD:"bd-pink",
	FOLLOW_BD:"bd-green",
	BADGE_BD:"bd-orange",

	UNKNOWN:"text-warning",
	RM_HINT:"text-warning action-reveal-rm",
	RM_REVEALED:"text-alert",
	LABEL_ACTIVE:"fg-cobalt",
	PARSE_ERROR:"text-alert",

	VOTE_BUTTON:{
		_common:"bg-hover-gray action-vote",
		up:"success",
		down:"warning",
		clear:"inverse"
	},
}

var TEXT_RETURN_ALT=" "+TAG("small","text-pilcrow",ICON("pilcrow"));

//v1.49, for removed usr
var DUMMY_USER={
	badges:[],
	is_following:false,
	is_followed_by:false,
	is_blocked:false,
	is_blocked_by:false,
	id:"",
	uid:"",
	username:"",
	roles:[],
	name:"帳號已被刪除",
	image:"D768239C61B080F71F4807B27C2A39A10BB44FB00C89B0675144F6403B23B4E5",
	desc:"本帳號已被刪除，因此此處顯示的帳號資料是虛擬的。",
	class_name:"(未知)",
	followers_count:0,
	following_count:0,
	school:"(未知)",
	_is_dummy:true
};

var valueOrOriginal=function(key,map){
	return map[key]||key;
}

var HASH={
	levelName: {
		"novice": ["初學者",1],
		"progress": ["大進步",2],
		"self_learner": ["自動自發",3],
		"advancer": ["加速前進",4],
		"smart": ["聰明狂人",5],
		"enthusiast": ["狂熱主義",6],
		"senior": ["資深學人",7],
		"talent": ["才能高超",8],
		"innovator": ["改革創新",9],
		"researcher": ["研究生",10],
		"influencer": ["影響家",11],
		"motivator": ["激勵領袖家",12],
		"unbeatable": ["所向無敵",13],
		"master": ["名家大師",14],
		"guru": ["權威人士",15],
		"professor": ["專家教授",16],
	},	
	badgeName: {
		"explorer": ["探險家",["於Books應用程式中閱讀","一頁+10分|累計30頁+15分"],[1e3,5e3,15e3]],
		"scout": ["影武者",["於YouTube中觀看在LM分享的影片","一部+10分|累計30部+15分"],[1e3,5e3,15e3]],
		"vanguard": ["好學士",["於Practice應用程式中完成考試","一次考試+10分|成績高於90分+15分|累計3次+15分"],[1e3,5e3,15e3]],
		"upgrader": ["助力士",["還不知道。","有賴活躍者提供。"],[5e2,3e3,12e3]],
		"connector": ["博學家",["於Books應用程式中新增註解","每則+3分"],[5e2,3e3,12e3]],
		"generator": ["學問星",["提出問題","每則+3分"],[1e3,5e3,12e3]],
		"trailblazer": ["善答星",["回答問題","每題問題+2分"],[5e2,3e3,12e3]],
		"validator": ["讚讚星",["對回答進行評分","???"],[5e2,3e3,12e3]],
		"apprentice": ["實習生",["登入","每天+1分|同日登入不重複計算"],[30,80,2e2]],
		"lodestar": ["北極星",["被其他人關注","每人+1分|不重複計算，解關注不會減少"],[30,80,2e2]],
		"visionary": ["夢想家",["發表貼圖","每則+3分"],[2e2,15e2,3e3]],
		"discoverer": ["發現家",["發表貼文","每則+1分"],[5e2,4e3,8e3]],
		"touchstone": ["感動家",["甩表情","每個+1分"],[2e2,15e2,3e3]],
		"catalyst": ["催化劑",["對貼文或貼圖發表評論","每則+1分"],[2e2,15e2,3e3]]
	},
	
	badgeLevel: {
		"bronze": "銅牌",
		"silver": "銀牌",
		"gold": "金牌"
	},
	
	mood: ["","熱愛","喜歡","無評論","討厭","憤怒"],
	
	exception:{"timeout":{txt:"連線逾時",fatal:true},
		"abort":{txt:"連線被取消",fatal:true},
		"error":{txt:"其他錯誤",fatal:true},
		"parsererror":{txt:"資料解析失敗",fatal:true}
	},

	failureTranslation:{
		"cannot follow oneself":"不能關注自己",
		"empty message":"訊息不能為空",
		"invalid parameters":"參數無效",
		"blocked":"已被封鎖，無法執行",
		"record not exist":"此紀錄不存在"
	}
};

var SUBJECT_MAP={
	10001:"建築",10002:"城市設計",10003:"藝術",10004:"媒體藝術",10005:"世界藝術與文化/舞蹈",10006:"設計",10007:"攝影",
	20001:"商業經濟",20002:"產業組織",20003:"統計與經濟計量",20004:"核心財務",20005:"估值和投資",20006:"風險投資和資本市場",20007:"銀行和貨幣",20008:"會計",20009:"工商管理",20010:"市場營銷",20011:"創業研究",
	30001:"媒體",30002:"媒體製作",30003:"傳播學",30004:"廣播",30005:"公關",30006:"辯論",30007:"電影",
	40001:"航空航天工程",40002:"大氣，海洋和空間科學",40003:"化學工程",40004:"土木與環境工程",40005:"電氣工程",40006:"工業工程",40007:"材料科學",40008:"機械工程",40009:"造船學",40010:"核工程與放射科學",
	50001:"健康研究",50002:"病理生理學",50003:"醫藥學",50004:"基因組學",50005:"藥理學",50006:"神經學",50007:"內分泌學",50008:"血液學",50009:"胃腸學",50010:"分子科學",
	60001:"寫作技巧",60002:"英語語言文學",60003:"比較文學",60004:"中國文學",60005:"美國劇院和戲劇",60006:"詩",60007:"編劇",
	70001:"算術",70002:"代數基礎",70003:"代數",70004:"幾何",70005:"三角",70006:"機率",70007:"統計",70008:"微積分基礎",70009:"微積分",70010:"微分方程式",70011:"線性代數",
	80001:"通識教育",80002:"邏輯",80003:"哲學史",80004:"倫理學與價值理論",80005:"認識論",80006:"現象學",
	90001:"生物學",90002:"化學",90003:"有機化學",90004:"物理",90005:"宇宙學和天文學",90006:"計算機科學",90007:"地理",
	100001:"音樂教育",100002:"編曲",100003:"音樂劇",100004:"戲劇和戲曲",100005:"音樂理論",100006:"木管樂器",100007:"打擊樂器",100008:"聲樂方法",100009:"樂隊管理",100010:"銅管樂器",
	110001:"歷史研究",110002:"中東史",110003:"亞洲史",110004:"歐洲史",110005:"美國歷史",110006:"拉丁美洲歷史",110007:"史前研究",
	120001:"政治學",120002:"民主理論",120003:"農業法",120004:"憲制性法律",120005:"財政和金融法",120006:"國際法",120007:"勞動和社會法",120008:"政治理論",120009:"國際關係",120010:"比較政治學",
	130001:"個性學",130002:"發展心理學",130003:"認知心理學",130004:"社會心理學",130005:"健康心理學",130006:"Pavlovian過程",
	140001:"佛教",140002:"古蘭經",140003:"禪：歷史，文化與批判",140004:"猶太人的視覺文化",140005:"世界宗教：中東",
	150001:"社會學的原理和存在",150002:"社會學理論",150003:"犯罪學",150004:"社會學視角",150005:"個人行為",150006:"社會正義，多樣性，認同，和社區",150007:"性別社會學",150008:"服務學習",
	160001:"運動訓練",160002:"運動科學",160003:"體育教育",160004:"體育管理",160005:"臨床經驗",160006:"體育財經",
	170001:"教育與心理",170002:"人類發展",170003:"多元文化的社會基礎",170004:"掃盲發展",170005:"教學方法",
	180001:"中文",180002:"英語",180003:"日文",180004:"法文",180005:"德語",180006:"阿拉伯語",180007:"西班牙文"
}

var SUBJECT_CATEGORY_NAME=[
	"藝術、設計","經濟","通訊","工程","醫學",
	"文學","數學","哲學","科學","音樂與戲劇",
	"歷史","法律與政治","心理學與社會科學","宗教","社會與文化",
	"運動","教育","語言"
];



//Random tip
var randomTip=[
	/*"Following/Unfollowing a user could be extremely slow(I don't know why), so be patient.", //關注或解關注的動作很花時間，所以建議要有點耐心。
	"Clicking on the name when the name card is shown can display one's bio, try it!", //名片畫面中點選名字可以看那個人的自介，試試看！
	"The size limitation on each image is 20MB. But I don't think LM server can stand that much.",
	"Cheers! Version 1.0 has born!",
	"If you want to see another tip, refreshing the page may help.",
	"Sorry for my poor coding style, I can't add such many features recently.",
	"Is Blocking/Unblocking necessary? Hope to hear your opinion.",
	"右下角的透明藍色按鈕是回到最上方用的喔。",
	"「關於LMClient」已經寫好了，歡迎瀏覽。",
	"A feature for following a 'post' has driven me crazy QAQ.",
	"After winter vacation, the site will not be able to be updated frequently.",
	"其實不太想叫它電腦版的，我為了使它能夠在手機瀏覽器上跑花了很多功夫，只是講習慣了。"
	"Following/Unfollowing a user could be extremely slow(I don't know why), so be patient.",
	"Recently, the API of the server has been changed. I did make a difference.",
	"The size limitation on each image is 20MB. But I don't think LM server can stand that much.",
	"If you want to see another tip, refreshing the page may help.",
	"After winter vacation, the site will not be able to be updated frequently.",
	"A good service is no need to be well-known. Users' happy experiences are the most precious things.",
	"If something goes wrong, simply tell me ASAP!",
	"Changelog have been fully updated~~ Read it now!"*/
	"隨機小提示全部重新寫過了！重新整理可以看到另一些提示喔。",
	"LM Textbook 已經因版權的緣故終止服務了，哭哭。",
	"Flyer內建的瀏覽器有時候會跑不出小圖示。舉例來說：["+ICON("database")+"]。",
	"程式碼現在是破三千五百行、快四十萬字了，這是超長篇小說！",
	"這個網頁常常在更新啊。懷疑是不是最新版的話，整個網頁重新整理一次就知道了。",
	"用網頁版留言的附帶優惠，是計算機科學的等級會升級。",
	"這網頁的圖標是 皮皮 用 InkScape 做的，詳見選單中的「關於...」。",
	"網頁的英文字型叫做 Roboto，是 Android 4.0+ 的系統字體(之一)。",
	"這網頁在Flyer預設瀏覽器的效能問題，一直是惡夢。",
	"關注/解關注常常會很遲鈍，這是伺服器的問題，需要耐心等待。",
	"想不到 Tips 了... 請常逛作者開發樓吧。",
	"網頁版沒有將圖片裁切或縮小的功能，拍照前請先將解析度調低，比較容易成功，也方便其他使用者觀看。"
];
