$(function(){
	/*-- 點擊左側選單 --*/
	$("#menu").click(function () {
		menu();
	});
	
	/*主要頻道選單設定*/
	$('.flex_focus').find('.newslist').addClass('newslist_main').removeClass('newslist');
	$('.flex_focus').find('.newsmain').addClass('newsmain_main').removeClass('newsmain');
	
	/*-- 左側展開時遮罩 --*/
	$('body').append('<div class="leftmask"></div>');
	$('#main').prepend('<div class="leftmask_down"></div>');
	
	/*-- 左側選單-分類向下展開收合 start --*/
	var timer;
	$('.newslist').hide();
	//$('.liston').next().slideDown();//在指定展開的選單 + class='liston.show()'
	
	$('.newsmain').click(function(){
		if($(this).find('.shownewslist').length > 0){
			//點擊後關閉
			$('.newsmain').find('.m20').removeClass('shownewslist').addClass('hidenewslist');
			$('.newsmain').next().slideUp(300);
			$('.newsmain').removeClass('liston');
			menuTimer();
		}else{
			$('.newsmain').find('.m20').removeClass('shownewslist').addClass('hidenewslist');
			$('.newsmain').next().slideUp(300);
			$('.newsmain').removeClass('liston');
			$(this).addClass('liston');
			$(this).find('.m20').removeClass('hidenewslist').addClass('shownewslist');
			$(this).next().slideDown(300);
			menuTimer();
		}
	})
	/*----------------------- 左側選單-分類向下展開收合 end --------------------------*/
	var ww = $(window).width();
	//var wwm = $('#main').width();
	//var h1Left = (ww-wwm)/2;
	var wwm;
	if(ww>=600){
		wwm = 600;
	}else{
		wwm = ww;
	}
	var h1Left = (ww-wwm)/2;
	$('h1').css({'left':h1Left,'width':wwm});
	$('.blackbg').css('width',wwm);
	$('.h1box,.marqueeTab3').css('width',wwm);
	$('.leftmask,.leftmask_down').css({'left':h1Left,'width':wwm});
})

$(window).resize(function(){
	var ww = $(window).width();
	    wwm = $('#rightmain').width();
	    h1Left = (ww-wwm)/2;
	$('h1').css({'left':h1Left,'width':wwm});
	$('.blackbg').css('width',wwm);
	$('.h1box,.marqueeTab3').css('width',wwm);
	$('.leftmask,.leftmask_down').css({'left':h1Left,'width':wwm});
	
	if($('#menu').hasClass('hidemenu')){
		$('h1').css({'left':h1Left+250,'width':wwm-250});
		$('.leftmask,.leftmask_down').css({'left':h1Left+250,'width':wwm-250});
	}
})

/*----- menu 收合or展開後，判斷高度 start -----*/
function menuTimer() {
	timer = setTimeout(function () {
		var wh = $(window).height();
		var viewheight = $('#leftmenu').height();//$('#leftmenu').height();
		if(wh > viewheight) viewheight = wh;
		$('body').attr('style','min-height:'+viewheight+'px;height:'+viewheight+'px;max-height:'+viewheight+'px');
		$('#main').attr('style','min-height:'+viewheight+'px;height:'+viewheight+'px;max-height:'+viewheight+'px');
	}, 500);
}
/*----- menu 收合or展開後，判斷高度 end -----*/

/*--------- 左側選單展開收合 start ---------*/
menuno = 0;
wtop = 0;
function menu(){
	var win = $(window);
	var top = win.scrollTop();
	
	if(menuno == 0){
		var wh = win.height();	
		wtop = top;
		
		//搜尋展開時,又點擊menu, 則重新取top值高度 ，不然抓的top值永遠=0
		if($('.hidesearch').length > 0){
			top = $('#rightmain').css('top');
			var intTop = parseInt(top, 10);//取top的整數值
			wtop = -intTop;//改為正整數
		}else{
			wtop = top;
		}
		$('#rightmain').css("top",-top);
		$('#rightmain').removeClass('leftmenu_c').addClass('rightmain_o');
		$('#leftmenu').removeClass('leftmenu_c').addClass('leftmenu_o');
		$('#menu').removeClass('showmenu').addClass('hidemenu');
		$('#rightmain,.door-bottom-space').animate({left:"250px"},350);
		$('#leftmenu').css("top",0);
		$('.back,#search_btn').css('opacity',0);
		
		var ww = win.width();
			wwm = $('#rightmain').width();
			h1Left = (ww-wwm)/2
		$('h1').animate({'left':h1Left,'width':wwm},0).animate({'left':h1Left+250,'width':wwm-250},350);
		$('.h1box,.marqueeTab3').css('width',wwm);
		
		var viewheight = $('#leftmenu').height();
		if(wh > viewheight) viewheight = wh;
		$('body').attr('style','min-height:'+viewheight+'px;height:'+viewheight+'px;max-height:'+viewheight+'px');
		$('#main').attr('style','min-height:'+viewheight+'px;height:'+viewheight+'px;max-height:'+viewheight+'px');
		$('h1').css({
			"top":0,
			"position": "fixed"
		})
		$('.topr').css('opacity',0);
		win.scrollTop(0);
		menuno = 1;
		$('#leftmenu').show();/*新增*/
		
		/*遮罩*/
		$('.leftmask,.leftmask_down').animate({'left':h1Left,'width':wwm},0).animate({'left':h1Left+250,'width':wwm-250},350).fadeIn(350);
		
		/*底部廣告*/
		$('.marquee-bottom,#door-bottom').animate({'bottom':-60},350);
	}
	else{}
  
	$('.leftmask').click(function(){
		$('#rightmain').removeClass('rightmain_o').addClass('rightmain_c');
		$('#leftmenu').removeClass('rightmain_o').addClass('leftmenu_c');
		$('#menu').removeClass('hidemenu').addClass('showmenu');
		$('h1').css({"top":0})//wtop
		$('#rightmain,.door-bottom-space').animate({left:"0px"},350);
		$('h1').animate({'left':h1Left,'width':wwm},350);
		$('.h1box').css('width',wwm);
		$('#leftmenu').css({"top":wtop});
		$('.back,#search_btn').animate({'opacity':1},350);
		
		$('#rightmain').css("top",0);
		var wh = $(window).height();
		$('body').attr('style','min-height:'+wh+'px;');
		$('#main').attr('style','min-height:'+wh+'px;');
		$('#rightmain').css("top",0);
		$('.topr').css('opacity',1);
		win.scrollTop(wtop);
		menuno = 0;
		
		$('.leftmask').animate({'left':h1Left,'width':wwm},350).fadeOut(100);
		$('.leftmask_down').animate({'left':h1Left,'width':wwm},350);
		setTimeout(function () {
			$('#leftmenu').hide();/*新增*/
		}, 350);
		
		/*底部廣告*/
		$('.marquee-bottom,#door-bottom').animate({'bottom':0},350);
	})
}
/*---------- 左側選單展開收合 end ----------*/
