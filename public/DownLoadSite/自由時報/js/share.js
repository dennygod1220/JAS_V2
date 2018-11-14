
function community(d,s,h){
	return '<a id="'+d+'" href="'+h+'" target="_blank" class="boxTitle" data-desc="' + d +'"><img alt="&#25512;&#25991;&#21040;'+d+'" border="0" src="'+s+'" title="&#25512;&#25991;&#21040;'+d+'"></a>'; //推文到
}

var s,u,t,cu;
cu = $('link[rel="canonical"]').attr('href');
if (cu)
	u = cu;
else
	u = location.href;
u = u.replace(/&Slots=[A-Za-z]+/,'');
(function(){if(u.match(/\d{4}\/specials\/[a-zA-Z_0-9]+\/new/)!=null){ var d=new Date(); var n = u.lastIndexOf('/')+1; document.write("<img src='/IService3/gopv.php?u="+encodeURIComponent(u.substring(n))+'&'+d.getTime()+"' style='display:none'>");}})();
u1 = u;
t = encodeURIComponent(document.title);
u = encodeURIComponent(u);

function goShare(){
	if (!cookies_m.isPC() && arguments.length>0){
		var pos = arguments[0];
		console.log(pos);
		if (pos == 'm1'){
			goShare_m1();
			callFB();
			return;
		}else if (pos == 'm2'){
			goShare_m2();
			return;
		}
	}
	goShare_pc();
	callFB();
}

function goShare_pc(){
	var str = '<div class="pin-button"><a data-pin-do="buttonBookmark" null href="//www.pinterest.com/pin/create/button/"><img src="//assets.pinterest.com/images/pidgets/pinit_fg_en_rect_gray_20.png" /></a></div>'+'<div class="twitter-share">	<a class="twitter-share-button" href="https://twitter.com/share">Tweet</a></div>'+'<div id="fb-root"></div>'+ 
				'<div class="fb-like" data-href="'+u1+'" data-layout="button_count" data-action="like" data-show-faces="true" data-share="true"></div></span>';
	document.write(str);
	window.___gcfg = {lang: 'zh-TW'};
	(function() {
		var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
		po.src = 'https://apis.google.com/js/plusone.js';
		var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
	})();
	!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="//platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");
	callFB();
}

function goShare_m1(){
	var str = '<div id="fb-root"></div>'+ 
				'<span class="fblike"><div class="fb-like" data-href="'+u1+'" data-send="false" data-layout="button_count" data-width="84" data-show-faces="false"></div></span>';
	document.write(str);
	callFB();
}

function goShare_m2(){
	var str = community('fblike','assets/images/s_fb.png','http://www.facebook.com/sharer.php?u='+u+'&t='+t)+
				community('plurk','assets/images/s_plurk.png','http://www.plurk.com/?qualifier=shares&status='+u+' '+'('+t+')')+
				community('tweet','assets/images/s_twitter.png','https://twitter.com/home?status='+u1+' '+'('+t+')')+
				community('gplus','assets/images/s_google.png','https://plus.google.com/share?url='+u1)+
				community('line','assets/images/s_line.png','http://line.me/R/msg/text/?'+t+'/'+u);
	document.write('<div class="share_title"><span></span><h3>分享</h3></div><div class="share_btn">' + str + '</div>');
}

function goFBShare(){
	var str = '<div class="interFB">'+ '<div class="fb-like" data-href="'+u1+'" data-layout="button_count" data-action="like" data-show-faces="true" data-share="true"></div></div>';
	document.write(str);
}

function callFB(){
	(function(d, s, id) {
		var js, fjs = d.getElementsByTagName(s)[0];
		if (d.getElementById(id)) return;
		js = d.createElement(s); js.id = id;
		js.src = "//connect.facebook.net/zh_TW/all.js#xfbml=1&appId=140490219413038";
		fjs.parentNode.insertBefore(js, fjs);
	}(document, 'script', 'facebook-jssdk'));
}

function comments(s){ //photo
	$('#'+s).html('<a name="comments" /><div class="fb-comments" data-href="'+u+'" data-width="650" data-num-posts="5"></div>');
	FB.XFBML.parse($('#'+s));
}