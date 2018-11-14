/**
 * 所有會使用的javascript
 *
 * @author unknown
 * @date unknown
 * @since 2018/3/8 Jackson:2554 格式化文件、移除左側選單預設開啟新聞總覽
 * @since 2018/3/14 Jackson:2572 新增事件盒函式
 */

var cookies_admin = new cookies_admin_mode(window.location.host);
var cookies_www = new cookies_admin_mode('www.ltn.com.tw');

function cookies_admin_mode(mobile_key) {
    this.write = function (value) {
        document.cookie = mobile_key + '=' + value + ';domain=.ltn.com.tw;path=/';
    }

    this.read = function () {

        var cookies = document.cookie ? document.cookie.split('; ') : [];
        var res = '';
        for (var i = 0, l = cookies.length; i < l; i++) {
            var parts = cookies[i].split('=');
            var name = parts.shift();
            var cookie = parts.join('=');
            if (mobile_key && mobile_key === name) {
                res = cookie;
                break;
            }
        }

        return res;
    }
    this.isPC = function () {
        var res = this.read();
        if (res == '') {
            if (jQuery.browser.mobile)
                return false;
            else
                return true;
        } else {
            if (res == 'PC')
                return true;
            else
                return false;
        }
    }
};

(function (a) {
    (jQuery.browser = jQuery.browser || {}).mobile = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))
})(navigator.userAgent || navigator.vendor || window.opera);

function gotoWeb() {
    var url = $('link[rel="canonical"]').attr('href');
    if (typeof(url) == 'undefined')
        url = "http://" + webServer;
    window.location.replace(url);
}

var googletag = googletag || {};
googletag.cmd = googletag.cmd || [];
(function () {
    var gads = document.createElement('script');
    gads.async = true;
    gads.type = 'text/javascript';
    var useSSL = 'https:' == document.location.protocol;
    gads.src = (useSSL ? 'https:' : 'http:') +
        '//www.googletagservices.com/tag/js/gpt.js';
    var node = document.getElementsByTagName('script')[0];
    node.parentNode.insertBefore(gads, node);
})();

/**
 * 事件盒
 *
 * @since 2018/3/14 Jackson:2572
 * 搬移部份 view/mobile/index.php javascript 至此
 */
$(function () {
    $(".event").each(function () {
        $('a:lt(2)', this).attr('href',
            function (i, v) {
                return v.replace('http://' + newsServer + '/news/', 'news/')
            }
        );
        // 把第二則之後的新聞隱藏
        $('li:gt(2)', this).hide();
    });
});

/**
 * unknown
 *
 * @since 2018/3/8 Jackson:2554 移除左側選單預設開啟新聞總覽
 */
$(function () {
    $('.news .listS_03 img').each(function () {
        var p_width = $(this).width();
        var six_div_width = $('.news .listS_03').width();
        var p_margin_left = p_width / 2 - six_div_width / 2;
        $(this).css('marginLeft', -p_margin_left);
    })

    /* house ad */
    $('.ltn_ad').each(function () {
        var img = '<img src="' + cachePath + '/app/program/impression.php?ano=' + $(this).attr('data-no') + '&_' + new Date().getTime() + '">';
        $(this).append(img);
    });

    /*-------------------------------- 列表圖 ------------------------------------*/
    listImg();//列表大圖
    /*--------------------- 新聞總覽分類頁_子分類選單展開收合 start ---------------------*/
    $('a.newslink,.newslide a').click(function () {
        if ($('.n_show').length > 0) {
            $('a.newslink').addClass('n_hide').removeClass('n_show');
            $('.newslide').slideUp(300);
        } else {
            $('a.newslink').addClass('n_show').removeClass('n_hide');
            $('.newslide').slideDown(300);
        }
    })
    $('#menu,#search_btn').click(function () {
        $('a.newslink').addClass('n_hide').removeClass('n_show');
        $('.newslide').slideUp(300);
    })
    /*---------------------- 新聞總覽分類頁_子分類選單展開收合 end -----------------------*/
    hiddenImg();
    ellipsis();
    newsLiP();
})

function newslide(key) {
    var cookies = document.cookie ? document.cookie.split('; ') : [],
        res = '';
    for (var i = 0, l = cookies.length; i < l; i++) {
        var parts = cookies[i].split('='),
            name = parts.shift(),
            cookie = parts.join('=');
        if (key === name) {
            res = cookie;
            break;
        }
    }
    if (res == '') {
        var d = new Date();
        d.setTime(d.getTime() + (24 * 60 * 60 * 1000));
        document.cookie = key + '=1;path=/;expires=' + d.toUTCString();
        $('a.newslink').addClass('n_show').removeClass('n_hide');
        $('.newslide').show();
    }
}

function listS_w($o) {
    var $pr = $o.parent('div');
    $pr.addClass('listS_w').removeClass('listS_h');

    var p_width = $o.width(),
        six_div_width = $pr.width(),
        p_margin_left = p_width / 2 - six_div_width / 2;
    $o.css('marginLeft', -p_margin_left);
}

$(window).resize(function () {
    listImg();//列表大圖
    hiddenImg();
    ellipsis();
})

$.fn.scrollStopped = function (callback) {
    $(this).scroll(function () {
        var self = this, $this = $(self);
        if ($this.data('scrollTimeout')) {
            clearTimeout($this.data('scrollTimeout'));
        }
        $this.data('scrollTimeout', setTimeout(callback, 250, self));
    });
};

$(function () {
    var win = $(window);
    haveh1 = 0;
    win.scrollStopped(function () {
    });
    win.bind("scroll", function (event) {
        var top = win.scrollTop();
        if (top >= 250) {
            $("#topr").fadeIn(300);
        }
        else
            $("#topr").fadeOut(300);
    });
    $("#topr").click(function () {
        $('html, body').animate({scrollTop: $('html, body').offset().top}, 500);
    });

    $("#gotopc,#gotopcf").click(function () {
        cookies_admin.write('PC');
        setTimeout('gotoWeb()', 500);
    });

    ImgHandMove();
    ga_send_event_init();

});

function ImgHandMove() {
    var startX;
    var startY;
    /*最小移動值*/
    var min_move = 50;

    /*最大圖層值*/
    var zIdx = 100;
    /*目前顯示項目值*/
    var nowIdx = 0;
    /*圖片群組*/
    var ph = $('.lbox .photo')
    /*圖片數量*/
    var maxIdx = ph.length;
    /*分隔點*/
    var posIdx = Math.floor(maxIdx / 2);

    $(document).on('touchmove', function (e) {
        var nowX = e.originalEvent.touches ? e.originalEvent.touches[0].pageX : e.pageX;
        var nowY = e.originalEvent.touches ? e.originalEvent.touches[0].pageY : e.pageY;

        var dx = startX - nowX;
        var dy = startY - nowY;

        var len = $(e.target).parents('.photo').length;
        if (len >= 1) {
            if (Math.abs(dx) >= Math.abs(dy)) {
                e.preventDefault();
            } else {
            }
        }

    });

    $('.bt').on('click.next', '.btr', function (e) {
        stopplay();
        moveNext();
    }).on('click.prev', '.btl', function (e) {
        stopplay();
        movePrev();
    });

    $('.lbox').on('touchstart', function (e) {
        stopplay();
        startX = e.originalEvent.touches ? e.originalEvent.touches[0].pageX : e.pageX;
        startY = e.originalEvent.touches ? e.originalEvent.touches[0].pageY : e.pageY;
    }).on('touchend', function (e) {
        var nowX = e.originalEvent.changedTouches ? e.originalEvent.changedTouches[0].pageX : e.pageX;
        var nowY = e.originalEvent.changedTouches ? e.originalEvent.changedTouches[0].pageY : e.pageY;

        var dx = startX - nowX;
        var dy = startY - nowY;
        if (Math.abs(dx) >= min_move) {
            if (dx > 0) {
                moveNext();
            } else {
                movePrev();
            }
        } else {
            fnMove(0);
        }

    });

    $(document).ready(function () {
        fixHeight();
        fnMove(0);
        startplay();
    });

    /*手機轉向, 重新取高度*/
    $(window).resize(function () {
        fixHeight();
        fnMove(0);
    });

    function fixHeight() {
        var w = $(window).width();
        var h = parseInt((w * 300) / 490, 10);
        if (w >= 490) h = 300, w = 500;
        if (w <= 300) h = 185;//185

        $('.lbox').css({
            'overflow': 'hidden',
            'height': h + 70
        });

        $('.picbox > a').css({
            'height': h
        });
    }

    /*自動播放*/
    var autoplay;
    var play = true;

    function startplay() {
        if (!play) {
            return;
        }
        autoplay = setInterval(function () {
            moveNext();
        }, 3000);
    }

    function stopplay() {
        play = false;
        if (autoplay) clearInterval(autoplay);
    }

    /*
    將　0, 1, 2, 3, 4, 5
    轉換0, 1, 2,-3,-2,-1

    將　0, 1, 2, 3, 4, 5
    轉換1, 2,-3,-2,-1, 0
    */
    function get_order(i) {

        var idx = i - nowIdx;
        if (i > (nowIdx + posIdx)) {
            idx -= maxIdx;
        } else if (i < (nowIdx - posIdx)) {
            idx += maxIdx;
        }
        return idx;

    }

    function moveNext() {
        nowIdx = get_now_idx(nowIdx + 1);
        fnMove(250);
    }

    function movePrev() {
        nowIdx = get_now_idx(nowIdx - 1);
        fnMove(250);
    }

    var moveing = false;
    var init = false;

    function fnMove(delay) {

        if (!init) {
            ph.css({
                'position': 'absolute'
            }).addClass('photoOn');
            init = true;
        }

        var width = $(ph[nowIdx]).width();
        /*移動時先鎖定, 避免重覆執行*/
        if (moveing) return;
        moveing = true;
        ph.each(function (i) {
            var od = get_order(i);
            $(this).css({
                'z-index': zIdx - Math.abs(od)
            }).animate({
                'left': (width * od)
            }, delay, function () {
                if (i == nowIdx) moveing = false;
            });
        });

    }

    function get_now_idx(v) {
        var nowVal = v;
        if (nowVal < 0) nowVal = maxIdx - 1;
        if (nowVal >= maxIdx) nowVal = 0;
        return nowVal;
    }

}

function ga_send_event_init() {
    var base_root_org = 'http://' + mobileServer;
    var deviceDesc = $("meta[name='ltn:device']").attr('content') || 'U';
    /*取頁面說明*/
    var _pageDesc = $('.page-name').attr('data-desc'),
        pageDesc = deviceDesc + ':' + _pageDesc;

    $(document.body).on('click.ga', '.boxInput', function () {
        var obj = $(this);
        var objDesc = obj.attr('data-desc');

        var par = obj.parents('.boxTitle');
        var boxDesc = par.attr('data-desc');

        var category = pageDesc;
        var action = boxDesc;
        /*使用自定義說明*/
        var label = objDesc || '';

        ga_send_event(category, action, label);

    });

    $('.boxTitle').on('click.count', 'a[class!=ad]', function (e) {
        if (e.button != 0) {
            return;
        }
        if (getinfo($(this), false)) e.preventDefault();
    }).on('mouseup.count', 'a[class!=ad]', function (e) {
        if (e.button != 1) {
            return;
        }
        getinfo($(this), true);
        e.preventDefault();
    });

    var getinfo = function (obj, SendOnly) {

        var objText = obj.text();
        var objDesc = obj.attr('data-desc');

        var par = obj.parents('.boxTitle');
        /*取區塊說明*/
        var boxDesc = par.attr('data-desc');
        /*是否用連結文字*/
        var useText = par.hasClass('boxText');

        var category = pageDesc;
        var action = boxDesc;
        /*使用自定義說明*/
        var label = objDesc || '';

        if (useText && label == '') {
            /*使用連結文字*/
            label = objText || '';
        }

        var labelA = label;
        var idx = $('a', par).index(obj);

        if (label == '') {
            /*記錄該區塊第幾則*/
            label = '第' + idx + '則';
        }

        var target = obj.attr('target');
        var href = '';
        var _href = obj.attr('href');

        if (_href) {
            href = check_url(_href);
        }

        var send_type = 'send';

        if (!target && href != '') {
            send_type = 'redirect';
        }

        if (SendOnly) send_type = 'send';

        setltncookies(action, idx, labelA);

        if (send_type == 'send') {
            ga_send_event(category, action, label);
            return false;
        } else {
            send2ga2page(category, action, label, href);
            return true;
        }

        function setltncookies(area, item, elem) {
            var ov_sec = 30;
            ltncookies_news("ltn_device", deviceDesc, ov_sec);
            ltncookies_news("ltn_page", _pageDesc, ov_sec);
            ltncookies_news("ltn_area", area, ov_sec);
            ltncookies_news("ltn_item", item, ov_sec);
            ltncookies_news("ltn_elem", elem, ov_sec);
        }
    }

    function check_url(_url) {
        if ((/^http:/).test(_url)) {
            return _url;
        } else if ((/^https:/).test(_url)) {
            return _url;
        } else if ((/^javascript/).test(_url)) {
            return '';
        } else if ((/^#/).test(_url)) {
            return '';
        } else {
            var base_root = $('base').attr('href') || base_root_org;
            return base_root + _url;
        }
    }

    /*GA事件追蹤:頁面不轉換*/
    function ga_send_event(category, title, label) {
        ga_send_event_callback(category, title, label, function () {
        });
    }

    /*GA事件追蹤:頁面轉換*/
    function ga_send_event_callback(category, title, label, fn_callback) {
        //return fn_callback();
        ga('send', 'event', category, title, label, {
            'hitCallback':
                function () {
                    fn_callback();
                }
        });
    }

    /*GA事件追蹤:連結點擊*/
    function send2ga2page(category, title, label, url) {
        var redirectTriggered = false;

        ga_send_event_callback(category, title, label, function () {
            redirectTriggered = true;
            document.location.assign(url);
        });

        setTimeout(function () {
            if (!redirectTriggered) {
                document.location = url;
            }
        }, 1500);
    }
};

/*列表圖*/
function listImg() {
    var w = $(window).width();
    var listWidth = $('.listA_03').width();
    var imgH = parseInt((listWidth * 880) / 660, 10);

    if (w >= 600) imgH = 763;
    $('.listA_03').css('max-height', imgH);
}

function hiddenImg() {
    var w = $(window).width();
    /*fb*/
    if (w >= 600) w = 600;
    if (w <= 300) w = 300;
    $('.add_fb .fb-like').attr("data-width", w - 60);
}

/*文字溢出*/
function ellipsis() {
    var ellipsis = $('#main').width();
    $('.newstit .tWord,.relatedtit .tWord').css('max-width', ellipsis - 30);
    $('.newstit a .tWord').css('max-width', ellipsis - 70);
    $('.event a .tWord').css('max-width', ellipsis - 120);
    $('.relatop .tWord').css('max-width', ellipsis - 100);

    var searchtag = ellipsis - 30
    $('.searchtag').css('width', searchtag)
}

/**/
function newsLiP() {
    $('.news li p').each(function () {
        if ($(this).siblings().hasClass('listS_h') || $(this).siblings().hasClass('listS_w')) {
            $(this).css('margin-left', 110);
        }
    })
}

function getSize() {
    if (window.screen.width <= 320) {
        return ['fluid', [300, 250]];
    } else {
        return ['fluid', [336, 280], [300, 250]];
    }

}