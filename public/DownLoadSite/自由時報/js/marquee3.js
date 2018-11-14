var marquee3 = function (ItemNo) {
	if (ItemNo > 3) {
		$('.mar_2,.mar_3').remove();
	}
	var debug = function(msg){
		console.log(msg);
	}

	var delay = function(fn, delaytime){
		setTimeout(fn,delaytime);
	}

	var lineMax = 0;
	function countLineMax() {
		lineMax = 0;
		$('.marqueeBox3 a').each(function () {
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

		var lenA = $(e.target).parents('.marqueeTab3').length;
		if (lenA >= 1) { e.preventDefault(); }
	});

	var lineX;
	var lineY;
	var lineStep = 0;
	var IsTouchs = false;
	$('.marqueeTab3').on('touchstart', function (e) {
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
	$('.marqueeTab3').on('mousedown', function (e) {

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
		$('.marqueeBox3 a').each(function(idx){
			nowStep[idx] = parseInt($(this).css('left'),10);
		});
	}

	var IsStep = false;
	function MoveCycle(dx, flag){

		$('.marqueeBox3 a').css('left', function(index, style){
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

		$('.marquee-bottom3').show();
		removeItem(ItemNo);
		countLineMax();
		setTimeout(function(){
			startplay();
		}, 800);

	function loadData(_CallBack){

		var category_no = {"focus": 1,"politics": 2,"society": 3,"life": 4,"world": 5,"opinion": 6,"business": 7,"sports": 8,"local": 9,"entertainment": 10,"consumer": 11,"supplement": 12,"3c": 13,"auto": 14,"video": 15,"week": 16};

		$.get('/js/marquee_data.php', function(db){

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
				var sIdx = (tIdx+5) % lidx;
				var nIdx = (sIdx+_d) % lidx;
				var obj = db[_n][nIdx];
				var _cate = obj.category || _n;
				return '<b><img src="/images/index/t'+category_no[_cate]+'.gif"></b> <a href="'+obj.url+'">'+obj.title+'</a>';
			}

		});

	}

	function fixTabWidth(){
		var w = $('#main').width()-80;
		//if (AnimateAction) {
			//$('h1.s_scroll').find('.marqueeTab3').animate({width:w},500);
		//} else {
			$('h1.s_scroll').find('.marqueeTab3').css('width',w);
		//}
	}

	function removeItem(ItemNo) {
		if (ItemNo > 3) {
			$('.marqueeTit3').append($('.marqueeBox3 .mar_' + ItemNo));
		}
		$('.marquee3').attr('id','mar_' + ItemNo);
	}

	function marqueeTabswitch(ItemNo) {
		if (ItemNo > 3) {
			var win_top = $(this).scrollTop();
			if (win_top <= 40){ //win_top <= 0
				$('h1').removeClass('s_scroll').addClass('s_index');
			} else {
				$('h1').removeClass('s_index').addClass('s_scroll');
				fixTabWidth();
			}
		}
	}

	var AnimateAction = 0;
	$().ready(function() {
		AnimateAction = 1;
		marqueeTabswitch(ItemNo);
	})
	$(window).scroll(function(){
		AnimateAction = 1;
		marqueeTabswitch(ItemNo);
	});
	$(window).resize(function(){
		AnimateAction = 0;
		marqueeTabswitch(ItemNo);
	});
};
