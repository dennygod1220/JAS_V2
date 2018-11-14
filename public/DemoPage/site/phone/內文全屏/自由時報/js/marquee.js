var marquee = function () {

	var debug = function(msg){
		console.log(msg);
	}

	var delay = function(fn, delaytime){
		setTimeout(fn,delaytime);
	}

	var lineMax = 0;
	function countLineMax() {
		lineMax = 0;
		$('.marqueeBox div').each(function () {
			var obj = $(this);
			obj.css({
				'left': lineMax
			});
			lineMax += obj.outerWidth(true);
		});
	}

	var startX;
	var startY;
	$(document).on('touchmove', function (e) {

		var nowX = e.originalEvent.touches ? e.originalEvent.touches[0].pageX : e.pageX;
		var nowY = e.originalEvent.touches ? e.originalEvent.touches[0].pageY : e.pageY;

		var dx = startX - nowX;
		var dy = startY - nowY;

		var lenA = $(e.target).parents('.marqueeTab').length;
		if (lenA >= 1) { e.preventDefault(); }
	});

	var lineX;
	var lineY;
	var lineStep = 0;
	var IsTouchs = false;
	$('.marqueeTab').on('touchstart', function (e) {
		IsTouchs = true;
		lineX = e.originalEvent.touches ? e.originalEvent.touches[0].pageX : e.pageX;
		lineY = e.originalEvent.touches ? e.originalEvent.touches[0].pageY : e.pageY;

		KeepNowLeft();

	}).on('touchmove', function (e) {
		var nowX = e.originalEvent.changedTouches ? e.originalEvent.changedTouches[0].pageX : e.pageX;
		var nowY = e.originalEvent.changedTouches ? e.originalEvent.changedTouches[0].pageY : e.pageY;

		var dx = lineX - nowX;
		var dy = lineY - nowY;

		MoveCycle(dx, false);

	}).on('touchend', function (e) {
		var nowX = e.originalEvent.changedTouches ? e.originalEvent.changedTouches[0].pageX : e.pageX;
		var nowY = e.originalEvent.changedTouches ? e.originalEvent.changedTouches[0].pageY : e.pageY;
		delay(function(){IsTouchs = false;},1000);
	});

	var IsDown = false;
	var IsMove = false;
	var IsDealy = false;
	$(document).on('mouseup', function (e) {
		var nowX = e.clientX;
		var nowY = e.clientY;

		var dx = lineX - nowX;
		var dy = lineY - nowY;

		if (dx == 0) {
			IsMove = false;
		} else {
			IsMove = true;
		}
		IsDown = false;
		delay(function(){IsDealy = false;},1000);
	});

	var nowStep = {};
	$('.marqueeTab').on('mousedown', function (e) {

		IsDown = true;
		IsDealy = true;

		KeepNowLeft();

		lineX = e.clientX;
		lineY = e.clientY;
		return false;
	}).on('mousemove', function (e) {

		if (!IsDown) return;

		var nowX = e.clientX;
		var nowY = e.clientY;

		var dx = lineX - nowX;
		var dy = lineY - nowY;

		MoveCycle(dx, false);

	}).on('click.move', 'a', function(e){
		if(IsMove) e.preventDefault();
	});

	/*保留當前位置*/
	function KeepNowLeft(){
		nowStep = {};
		$('.marqueeBox div').each(function(idx){
			nowStep[idx] = parseInt($(this).css('left'),10);
		});
	}

	var IsStep = false;
	function MoveCycle(dx, flag){

		$('.marqueeBox div').css('left', function(index, style){
			var width = $(this).outerWidth(true);

			var s_point = 0-width;
			var e_point = lineMax-width;
			var left = (flag) ? parseInt(style,10) : nowStep[index]; //parseInt(style,10);

			left -= dx;

			if(left==0){
				IsStep = true;
				delay(function(){IsStep=false;}, 500);

			}

			if(left<=s_point){
				/*移到尾端*/
				return lineMax+left; /*left為負值, 得一正值*/
			}else if(left>=e_point){
				/*移到前端*/
				return left-lineMax; /*left為正值, 得一負值*/
			}else{
				/*依現值減少*/
				return left;
			}
		});
	}

	/*自動播放*/
	var autoplay;
	var play = true;
	function startplay(){
		if(!play){return;}

		autoplay = setInterval(function(){
			if(IsStep) return; /*暫停*/
			if(IsDealy) return; /*滑鼠按下後*/
			if(IsTouchs) return; /*手指點到*/
			MoveCycle(1, true);
		},13);
	}

	function stopplay(){
		play = false;
		if(autoplay) clearInterval(autoplay);
	}

	loadData(function(_body){
		$('.marqueeBox').empty().append(_body);
		$('.marquee-bottom').show();
		countLineMax();
		setTimeout(function(){
			startplay();
		}, 800);
		
		fixTabWidth();
		
		if(IsIOS()){
			$('.marqueeTab').addClass('mt_ios');
		}else{
			$('.marqueeTab').addClass('mt_else');
		}
			
		function IsIOS(){
			return !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
		}
		
	});
	
	$(window).resize(function(){
		fixTabWidth();
	});
	
	function fixTabWidth(){
		var ww = $(window).width();
		if(ww>600) ww = 600;
		$('.marqueeTab').width(ww-60);
	}

	function loadData(_CallBack){

		var category_no = {
			"focus": "焦點",
			"politics": "政治",
			"society": "社會",
			"life": "生活",
			"world": "國際",
			"opinion": "言論",
			"business": "財經",
			"sports": "體育",
			"local": "地方",
			"entertainment": "娛樂",
			"consumer": "消費",
			"supplement": "副刊",
			"3c": "3C",
			"auto": "汽車",
			"video": "影音",
			"week": "週報",
			"istyle": "時尚"
		};

		$.get('ajax_main/get_hot_roll', function(db){

			var lineBody = '';
			var tIdx = ((new Date()).getTime());
			for(var idx=0;idx<10;idx++){

				if(idx==4){
					/*3C*/
					lineBody += '<div><span>'+newsItem('3c', idx)+'</span></div>';
				}else if(idx==9){
					lineBody += '<div><span>'+newsItem('auto', idx)+'</span></div>';
				}else if(idx==0 || idx==5){
					/*今天*/
					lineBody += '<div><span>'+newsItem('Today', idx)+'</span></div>';
				}else{
					/*7天熱門*/
					lineBody += '<div><span>'+newsItem('7day', idx)+'</span></div>';
				}
			}

			if(lineBody!=''){ _CallBack(lineBody); }

			function newsItem(_n, _d){
				var lidx = db[_n].length;
				if (lidx > 0){
					var sIdx = (tIdx+5) % lidx,
						nIdx = (sIdx+_d) % lidx,
						obj = db[_n][nIdx],
						_cate = obj.category || _n;
					return '<b class="t_tag">' + category_no[_cate] + '</b> <a href="'+obj.url+'">'+obj.title+'</a>';
				} else {
					return '';
				}
			}

		});

	}

};
/*$(function(){
    marquee();
})*/