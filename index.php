<!DOCTYPE html>
<html lang="zh-tw">
	<head>
		<meta charset="UTF-8"/>
		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
		<meta name="product" content="非官方Learn Mode"/>
		<meta name="description" content="網頁版LearnMode，不用平板也能隨時追蹤學習平台上的貼文！電腦可用，而且專為手機/平板優化！"/>
		<meta name="author" content="師大附中1296潘廣霖"/>
		<meta name="keywords" content="Learn Mode, LearnMode, lm, ggt, andy0130tw, lmclient, Learn Mode 電腦版"/>
		<title>Learn Mode</title>
		
		<link rel="icon" type="image/png" href="res/icon.png"/>
		<!----><link rel="stylesheet" href="res/css/metro-bootstrap.min.css"/>
		<link rel="stylesheet" href="res/css/metro-bootstrap-responsive.min.css"/>
		<link rel="stylesheet" href="res/css/magnific-popup.css"/>
		<link rel="stylesheet" href="res/css/shadowbox.css"/>
		<link rel="stylesheet" href="res/css/bootstrap.component.min.css"/>

		<link rel="icon" type="image/png" href="res/icon.png"/>
		<!--<link rel="stylesheet" href="res/css/lm-lib.min.css"/>-->
		<link rel="stylesheet" href="res/css/lm.css"/>
		<link rel="stylesheet" href="res/css/lm.colorful.css"/>
		<link rel="stylesheet" href="res/css/global.css"/>
		<link rel="stylesheet" href="res/css/popup.css"/>
	</head>
	
	<body class="metro">
	<header style="height:45px">
		<nav class="navigation-bar dark fixed-top shadow">
			<nav class="navigation-bar-content container">
				<!-- Title Menu -->
				<a href="#" id="menu-title-mobile" class="element no-desktop no-large">
					<span class="icon-database"></span> LM Client<sub style="font-size:85%;">ver. <span class="fill-version"></span></sub> - <span class="fill-username"></span>
				</a>
				<span class="element-divider"></span>
				<!-- For responsive usage -->
				<a class="pull-menu needsclick" href="#"></a>
				<a class="refresh-menu action-refresh no-desktop no-large" href="#"></a>
				<!-- Left Section -->
				<ul class="element-menu">
				<li>
					<a class="dropdown-toggle" href="#">
						<span class="no-desktop no-large"><span class="icon-home"></span> 主選單</span>
						<span class="no-phone no-tablet-portrait"><span class="icon-database"></span> LM Client<sub style="font-size:85%;">ver. <span class="fill-version"></span></sub>&nbsp;</span>
					</a>
					<ul class="dropdown-menu" data-role="dropdown">
						<li><a onclick="navClick(openPostShareForm)"><span class="icon-forward"></span> 發佈訊息</a></li>
						<li><a class="dropdown-toggle" href="#"><span class="icon-user-2"></span> 帳戶</a>
							<ul class="dropdown-menu" data-role="dropdown">
							<li><a href="#" class="action-account">MAC:<strong id="dp-mac">?</strong></a></li>
							<li class="divider"></li>
							<li><a id="editInfoBtn" href="#"><span class="icon-pencil"></span> 修改個人資訊</a></li>
							<li><a id="logoutBtn" href="#"><span class="icon-exit"></span> 登出</a></li>
							</ul>
						</li>
						<li><a href="#" id="action-search"><span class="icon-search"></span> 搜尋使用者</a></li>
						<li class="divider"></li>
						<li><a class="action-reply" data-id="52EF3CA1DBCA1D06940AADEA"><span class="icon-accessibility"></span> 作者開發樓</a></li>
						<li class="divider"></li>
						<li><a class="dropdown-toggle" href="#"><span class="icon-lab"></span> 實驗中功能</a>
							<ul class="dropdown-menu" data-role="dropdown">
							<li><a href="#" onclick="experimental(1)"><span class="icon-lab"></span> 強制玄奇樓</a></li>
							<li><a href="#" onclick="experimental(6)"><span class="icon-lab"></span> 究極玄奇樓</a></li>
							<li><a href="#" onclick="experimental(2)"><span class="icon-lab"></span> 封鎖他！</a></li>
							<li><a href="#" onclick="experimental(3)"><span class="icon-lab"></span> 解除封鎖他！</a></li>
							<li><a href="http://lm.twbbs.org/QRCodeGenerator.html" target="_blank"><span class="icon-copy"></span> QR 生成器</a></li>
							<!--<li><a href="#" onclick="experimental(4)"><span class="icon-lab"></span> 優化 Flyer 的圖片顯示效能</a></li>-->
							</ul>
						</li>
						<!--<li><a onclick="navClick(openNewsForm);"><span class="icon-address-book"></span> 更新紀錄</a></li>-->
						<li><a onclick="navClick(function(){modal('#popup-about',false,true);})"><span class="icon-puzzle"></span> 關於LMClient...</a></li>
					</ul>
				</li>
				<span class="element-divider"></span>
				<li><a href="#" id="myActivity"><span class="icon-comments-3"></span> 首頁</a></li>
				<span class="element-divider"></span>
				<li><a class="dropdown-toggle" href="#"><span class="icon-feed"></span> 訊息</a>
					<ul class="dropdown-menu" data-role="dropdown">
					<li class="menu-title">動態</li>
						<li><a href="#" id="myActivity2"><span class="icon-comments-3"></span> 自己的</a></li>
						<li><a href="#" id="allActivity"><span class="icon-broadcast"></span> 全系統</a></li>
					<li class="menu-title">公告</li>
						<li><a href="#" id="action-announcement"><span class="icon-newspaper"></span> 佈告欄</a></li>
					<li class="menu-title">實驗</li>
						<li><a href="#" id="action-history"><span class="icon-history"></span> 倒序排列</a></li>
					</ul>
				</li>
				<span class="element-divider"></span>
				<li><a class="dropdown-toggle" href="#"><span class="icon-list"></span> 分類</a>
					<ul class="dropdown-menu" data-role="dropdown">
					<li class="menu-title">主要</li>
					<li><a href="#" class="action-sel-em" data-category="share"><span class="icon-comments-4"></span> 愛分享</a></li>
					<li><a href="#" class="action-sel-em" data-category="question"><span class="icon-comments-2"></span> 大哉問</a></li>
					<li><a href="#" class="action-sel-em" data-category="scrapbook"><span class="icon-pictures"></span> 剪貼簿</a></li>
					<li class="menu-title">其他動態</li>
					<li><a href="#" class="action-sel-em" data-category="watch"><span class="icon-film"></span> 影片</a></li>
					<li><a href="#" class="action-sel-em" data-category="annotation"><span class="icon-book"></span> 書籍標註</a></li>
					<li><a href="#" class="action-sel-em" data-category="course"><span class="icon-camera-2"></span> 課程</a></li>
					<li><a href="#" class="action-sel-em" data-category="practice"><span class="icon-pencil"></span> Practice</a></li>
					</ul>
				</li>
				<span class="element-divider"></span>
				<li><a class="dropdown-toggle" href="#"><span class="icon-stats"></span> 紀錄</a>
					<ul class="dropdown-menu" data-role="dropdown">
					<li><a href="#" class="action-sel-em" data-category="!badge"><span class="icon-medal-2"></span> 獎牌/等級</a></li>
					<li class="menu-title">只有自己的</li>
					<li><a href="#" class="action-sel-em" data-category="!follow"><span class="icon-share-3"></span> 關注</a></li>
					<li><a href="#" class="action-sel-em" data-category="!emotion"><span class="icon-stats"></span> 甩表情</a></li>
					<li><a href="#" class="action-sel-em" data-category="!vote"><span class="icon-stats"></span> 評分</a></li>
					</ul>
				</li>
				<span class="element-divider"></span>

				<!--Right Section-->
				<span class="element-divider place-right"></span>
				<button class="element image-button image-left place-right no-phone no-tablet-portrait" id="accountBtn">
					<span class="fill-username">使用者名稱</span><img id="btn-user-img"/>
				</button>
				<span class="element-divider place-right"></span>
				<a class="element place-right no-phone no-tablet-portrait action-refresh" href="#">
					<span class="icon-cycle"></span>
				</a>
				<span class="element-divider place-right"></span>
				</ul>
			</nav>
		</nav>
	</header>
	
	<div id="btn-bringtop" class="bg-cyan fg-white"><span class="icon-arrow-up-5"></span></div>
	
	<!--Placeholder, <div class="no-phone no-tablet-portrait" style="height:50px;"></div>-->
	<!--Sub menu-->

	<div id="_loadingState" class="container grid clearfix">
		<div class="row"><div class="span8 offset2">
			<h1 class="loading">Now Loading.</h1>
			<p class="subheader-secondary">
				Starting up Learn Mode Client...
			</p>
			<p>
				Ps.如果等太久網頁還沒載入好，重新整理或許能解決問題。
			</p>
		</div></div>
	</div>

	<div id="header" class="container clearfix hide">
		<nav class="horizontal-menu"><ul>
			<li class="text-info">
				<span class="icon-location" style="font-size:2.2rem"></span><a class="dropdown-toggle" href="#"> <span id="nav-location">首頁</span></a>
				<ul class="dropdown-menu" data-role="dropdown">
					<li><a href="#" class="action-sel" data-category="all"><span class="icon-accessibility"></span> 全部動態</a></li>
					<li class="menu-title">主要</li>
					<li><a href="#" class="action-sel" data-category="share"><span class="icon-comments-4"></span> 愛分享</a></li>
					<li><a href="#" class="action-sel" data-category="question"><span class="icon-comments-2"></span> 大哉問</a></li>
					<li><a href="#" class="action-sel" data-category="scrapbook"><span class="icon-pictures"></span> 剪貼簿</a></li>
					<li class="menu-title">回覆</li>
					<li class="nohomemenu"><a href="#" class="action-sel" data-category="comment"><span class="icon-comments-3"></span> 評論</a></li>
					<li class="nohomemenu"><a href="#" class="action-sel" data-category="answer"><span class="icon-comments"></span> 回答</a></li>
					<li class="menu-title">其他</li>
					<li class="nohomemenu"><a href="#" class="action-sel" data-category="watch"><span class="icon-film"></span> 觀看影片</a></li>
					<li class="nohomemenu"><a href="#" class="action-sel" data-category="annotation"><span class="icon-book"></span> 書籍標註</a></li>
					<li class="nohomemenu"><a href="#" class="action-sel" data-category="course"><span class="icon-camera-2"></span> 課程</a></li>
					<li class="nohomemenu"><a href="#" class="action-sel" data-category="practice"><span class="icon-pencil"></span> Practice</a></li>
				</ul>
			</li>
			<!-- Don't put any space between them, or the blank will be shown. -->
			<div class="place-right">
				<li class="text-alert historymenu"><a href="#" onclick="void reloadWithReversed(false)">[<span class="icon-history"></span> 考古模式]</li></a><li class="usermenu"><a href="#" id="nav-album"><span class="icon-image"></span> 剪貼簿</a></li><li class="usermenu"><a href="#" id="nav-award"><span class="icon-medal"></span> 獎獎堂</a></li><li class="categorymenu"><a href="#" id="nav-myfollow"><span class="icon-pop-out"></span> 關注</a></li><li class="categorymenu"><a href="#" id="nav-new"><span class="icon-flag-2"></span> 最新</a></li><li class="hotmenu"><a href="#" id="nav-hot"><span class="icon-fire"></span> 熱門</a></li><li class="questionmenu"><a href="#" id="nav-unanswered"><span class="icon-comments-5"></span> 未回答</a></li>
			</div>
		</ul></nav>
		<nav class="horizontal-menu" style="margin-top:-8px;"><ul>
			<li class="text-muted"><a href="#" id="action-toggle-pin-list">
				<span class="icon-bookmark-4"></span> 追蹤列表 (<span class="fill-pin-count">...</span>)
			</a></li>
			<div class="place-right">
				<li class="usermenu"><a href="#" id="nav-following"><span class="icon-pop-out"></span> 我關注</a></li><li class="usermenu"><a href="#" id="nav-follower"><span class="icon-pop-in"></span> 粉絲團</a></li>
			</div>
		</ul></nav>
		<div class="listview-outlook no-animation" id="pin-list" style="clear:both;background:#F5F9FD;margin-bottom:24px;display:none;">
			<button class="link large" id="pinRefreshBtn"><span class="icon-download-2"></span> 立刻更新</button>
			<button class="link large on-right" id="pinAllReadBtn"><span class="icon-bookmark-2"></span> 全部已讀</button>
		</div>
	</div>

	<div id="root" class="container clearfix hide">
		<div class="listview-outlook" id="mainContent">
			<div class="list" tabindex="0"><div class="list-content">
				<strong class="list-title">Announcement</strong>
				<span class="label">Info:</span> Last Modified on <span class="fill-last-modify"></span> ver.<span class="fill-version"></span><br/>
				<span class="label">Random Tip:</span> <span class="fill-random-tip"></span>
			</div></div>
			<div class="list" tabindex="0"><div class="list-content">
				<strong class="list-title" onclick="$('#announcement-inside').fadeToggle(200)">
				<strong class="text-alert">Important!</strong> About Privacy (Click to read)</strong>
				<span id="announcement-inside" class="no-animation" style="display:none;">為了避免身分認證引起的爭議，我們打算在<del>之後</del>(還沒)開始蒐集瀏覽器相關的資料，是匿名的。<br/>To avoid doubts, we're going to (but not yet) send and collect data about your browser/OS. Be aware that no personal data will be logged.</span>
			</div></div>
		</div>
		
		<div id="main-loading" class="hide fg-navy"></div><br/>
		<div class="text-center">
			<button id="btn-loadmore" class="large info">LOAD MORE ENTRIES</button><br/>
		</div>
	</div>

	<div id="footer" class="container clearfix">
		<span class="tertiary-text">
		LMClient <big>v1</big>--- The next generation of LM. 2013-2014, LMClient © by Andy Pan<br/>
		The name of the site is inspired by <a href="http://ggt.tw/">LMClient on ggt.tw</a>. 

		</span>
		<span class="tertiary-text-secondary place-right">Powered by Bootstrap and Metro UI.</span><br/>
	</div>

	<!--Windows that are usually hidden-->
	<div data-load="popups.html"></div>
	<div id="popup-welcome" class="popup mfp-hide">
		<h2 id="welcome-msg">登入中...</h2>
		<h3>MAC: <span id="welcome-mac" class="label">XX:XX:XX:XX:XX:XX</span></h3>
		<div>
			<img id="welcome-img" class="padding10 place-left"/>
			<div class="padding10">
				<span>學校: <span id="welcome-school" class="label">？</span></span><br/>
				<span>HST login: <span id="welcome-hst" class="label">Loading...</span></span>
			</div><hr/>
			<!--<h3 style="clear:both;">本站公告</h3>-->
		</div><br/>
		<div class="btn-placeholder">
			<button class="action-dismiss place-right large default" onclick="splashNeedClose=false"><span class="icon-checkmark"></span> 關閉</button>
			<span id="welcome-hint" class="text-muted" style="opacity:0;">此視窗會自動關閉。</span>
		</div>
	</div>
	
	<div id="popup-login" class="popup mfp-hide">
		<h3>登入</h3>
		<p id="login-mac" class="text-center padding20 bg-grayLighter" style="font-size:140%;letter-spacing:.4rem;"></p>
		<div class="grid">
			<div class="row">
				<div class="span3">
					<div class="input-control text"><input type="text" id="login-input-mac" placeholder="MAC Address..."/></div>
					<div class="panel-group" id="popup-login-helper">
						<div class="panel panel-primary">
							<div class="panel-heading"><div class="panel-title"><a href="#popup-login-helper_1" data-toggle="collapse" data-parent="#popup-login-helper">輸入 MAC</a></div></div>
							<div class="panel-collapse collapse in" id="popup-login-helper_1"><div class="panel-body">
								請在框內輸入12個十六進位字元(不分大小寫)，或使用右側小鍵盤輸入。
							</div></div>
						</div>
						<div class="panel panel-warning">
							<div class="panel-heading"><div class="panel-title"><a href="#popup-login-helper_2" data-toggle="collapse" data-parent="#popup-login-helper">怎麼查 MAC 碼？</a></div></div>
							<div class="panel-collapse collapse" id="popup-login-helper_2"><div class="panel-body">
								Flyer 的 MAC 碼在<code>設定</code>-&gt;<code>關於平板電腦</code>-&gt;<code>硬體資訊</code>-&gt;<code>[Wi-Fi MAC位址]</code>。
							</div></div>
						</div>
					</div>
				</div>
				<div class="login-dialer span5">
					<button>1</button><button>2</button><button>3</button><br/>
					<button>4</button><button>5</button><button>6</button><br/>
					<button>7</button><button>8</button><button>9</button><br/>
					<button>0</button><button class="void">　</button><button class="backspace warning">←</button><br/>
					<button class="info">A</button><button class="info">B</button><button class="info">C</button>
					<button class="info">D</button><button class="info">E</button><button class="info">F</button>
				</div>
			</div>
			<div class="btn-placeholder">
				<button class="default large place-right" style="display:block;width:100%;" onclick="relogin()">輸入完畢</button>
			</div>
		</div>
	</div>
	<script src="res/js/jquery-1.10.2.min.js"></script>
	<script src="res/js/shadowbox.js"></script>
	<script src="res/js/lm-lib.min.js"></script>
	<script src="res/js/lm.js"></script>


	</body>
	
</html>