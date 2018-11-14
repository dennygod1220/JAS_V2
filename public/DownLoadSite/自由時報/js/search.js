wwtop = 0;

$(function() {
	//click open search
	$('#search_btn').click(function(){
		if($('.showsearch').length > 0){
			$('.search_hid').slideDown(300);//搜尋
			$('.search_mask').fadeIn(300);//遮罩
			$('#search_btn').removeClass('showsearch').addClass('hidesearch');
			
			//隱藏topr
			$("#topr").hide();
			
			//依照scrolltop位置，搬移#rightmain,.search_hid，至畫面瀏覽到的位置
			var top = $(window).scrollTop();
			wwtop = top;
			$('#rightmain').css("top",-top);
			$('.search_hid').css("top",top);
			
			
			//鎖遮罩的touchmove ，使遮罩後方物件不可滑動
			$('.search_mask').on("touchmove", function(e) {
				return false;
			});
            $('#leftmenu,.marquee3').hide();

            var start = $('#start_time').val();
            var end = $('#end_time').val();

            if (start.trim() != '' && end.trim() != '') {
                $('.sbox02').slideDown(300);
                $('#advanced').removeClass('showslide').addClass('hideslide');
            }
            scrollSearchHeight(); //重新新計算可scroll範圍

		}else{
			searchClose();
			$('.marquee3').show();
		}
	});

    $('.searchtime').click(function(){
        $( "#search_btn" ).trigger( "click" );
    });

	//當search展開時，點"黑色遮罩"，搜尋功能移除
	$('.search_mask').click(function(){
		searchClose();
		$('.marquee3').show();
	})
	//當search展開時，點擊"menu"，搜尋功能移除
	$('#menu').click(function(){
		$('#leftmenu').show();
		$('.search_hid').slideUp(300);//搜尋
		$('.search_mask').fadeOut(300);//遮罩
		$('#search_btn').removeClass('hidesearch').addClass('showsearch');
		$('.marquee3').show();
	})

	//點擊搜尋的進階搜尋
	$('#advanced').click(function(){
		if($('.showslide').length > 0){
			console.log('open');
			$('.sbox02').slideDown(300);
			$(this).removeClass('showslide').addClass('hideslide');
			scrollSearchHeight(); //重新新計算可scroll範圍
		}else{
            // input reset data
            $('.datepicker').datepicker('setDate', null);
            $('.send_search_input').val('');
			console.log('close');
			$('.sbox02').slideUp(300);
			$(this).removeClass('hideslide').addClass('showslide');
			scrollSearchHeight(); //重新新計算可scroll範圍
		}
    });

//    $('#search_submit_btn').click(search_click);

	//月曆
    $(".datepicker").datepicker({
		dateFormat: 'yy-mm-dd',//文字輸入框顯示格式
		showOtherMonths: true,
		selectOtherMonths: true,
		inline: true,
		showButtonPanel: true,
		currentText: "", 
		closeText: "",//close文字
		dayNamesMin: ["S","M","T","W","T","F","S"],//月曆星期顯示方式
		monthNames: ["1月 ‧","2月 ‧","3月 ‧","4月 ‧","5月 ‧","6月 ‧",
			"7月 ‧","8月 ‧","9月 ‧","10月 ‧","11月 ‧","12月 ‧"], // 月份
		beforeShow: function (input, inst) {//顯示月曆後
			var w = $(window).width();
			var pickerW = $(".ui-datepicker").css('width');
			var pickerLeft = (w-290)/2;
			setTimeout(function () {
				//console.log(inst);
				inst.dpDiv.css({
					'left': pickerLeft + 'px',
					'top': 120 + 'px'//175
				});
				$('#closex,#ui-datepicker-div:before').click(function(){
					$('#ui-datepicker-div').fadeOut(300);
				});
				$('#ui-datepicker-div').css('z-index',3000);
				$("#ui-datepicker-div").before('<div class="da-mask"></div>');
            }, 0);
		},
		
		onChangeMonthYear: function (input, inst) {//改變日期時
			setTimeout(function () {
				$('#closex,#ui-datepicker-div:before').click(function(){
					$('#ui-datepicker-div').fadeOut(300);
				});
            }, 0);
		},

        onSelect: function(dateText, inst) {
            var hide_input_name = $('#' + inst.id).attr('name');
            $('#' + hide_input_name).val(dateText);
        },
		onClose: function (input, inst) {//改變日期時
			setTimeout(function () {
				$('.da-mask').hide();
            }, 0);
		},
    });
});

var search_click = function()
{
    var keyword = $('#qs').val();

    if (keyword.trim() == '') {
        alert('請輸入關鍵字');
        return false;
    }

    var reg = /\s+/g;
    keyword = keyword.trim().replace(reg,' ');

    if (keyword.length > 50) {
        alert('關鍵字數過長');
        return false;
    }

    var res = keyword.split(" ");

    for (var key in res) {
        if (res[key].length < 2) {
            alert('每個關鍵字請超過兩個字');
            return false;
        }
    }

    if (res.length > 3) {
        alert('請勿超過三個關鍵字');
        return false;
    }

    var t = '';
    var q = '';

    var start = $('#start_time').val();
    var end = $('#end_time').val();

    if (start.trim() == '' && end.trim() == '') {
        q = 'q=' + encodeURIComponent(keyword);

        location.href='search?' + q;
        return false;
    }
    //如果是展開狀態判斷是否有開始時間/結束時間
    if ($('.hideslide').length > 0) {

        if (start.trim() == '') {
            alert('請選擇查詢時間');
            return false;
        }

        if (end.trim() == '') {
            alert('請選擇查詢時間');
            return false;
        }

        var start_time = new Date(start).getTime();
        var end_time = new Date(end).getTime();

        if (start_time > end_time) {
            alert('時間區間有誤');
            return false;
        }

        if (end_time > start_time) {
            if ((end_time - start_time) / 86400000 > 90) {
                alert('選擇區間最長三個月');
                return false;
            }
        }
        t= '&start=' + encodeURIComponent(start) + '&end=' + encodeURIComponent(end);
    }

    q = 'q=' + encodeURIComponent(keyword) + t;

    location.href='search?' + q;
}

$(window).resize(function(){
	var w = $(window).width();
	var pickerW = $(".ui-datepicker").css('width');
	var pickerLeft = (w-290)/2;
	$('#ui-datepicker-div').css('left',pickerLeft + 'px')
})


/*close search*/
function searchClose(){
	$('.search_hid').slideUp(300);//搜尋
	$('.search_mask').fadeOut(300);//遮罩
	$('#search_btn').removeClass('hidesearch').addClass('showsearch');
	$('#leftmenu').show();
			
	//移除所有鎖定的高度
	$('body').removeAttr('style');
	$('#main').removeAttr('style');
	$('#rightmain').css("top",0);
	$(window).scrollTop(wwtop);
}

/*重新新計算可scroll範圍*/
function scrollSearchHeight(){
	var viewHeight = $(window).height();
	//等'search box' 0.3秒展開後，才可以計算搜尋box高度
	setTimeout(function () {
		var searchHeight = $('.search_hid').height()+130;
				
		//如果搜尋box高度>螢幕高 ，scroll高度 = 搜尋box
		if(searchHeight > viewHeight) viewHeight = searchHeight;
				
		//反之 ，scroll高度 = 螢幕高
		$('body').attr('style','min-height:'+viewHeight+'px;height:'+viewHeight+'px;max-height:'+viewHeight+'px');
		$('#main').attr('style','min-height:'+viewHeight+'px;height:'+viewHeight+'px;max-height:'+viewHeight+'px');
		$(window).scrollTop(0);
	}, 300);
}

$(window).resize(function() {
	if($('.hidesearch').length > 0){
		scrollSearchHeight();
	}
});
