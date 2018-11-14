if (typeof console === "undefined" || typeof console.log === "undefined" || typeof console.clear === "undefined") {
    console = {};
    console.log = function () {};
    console.clear = function () {};
}

var tpl_height = '<div class="hl" style="display:block; " id="h1_{vod_id}"><div class="ct clearfix">';
tpl_height += '<div class="subimg"><a href="{str_url}"><img src="{azure_str_img}" onerror="this.src=\'{str_img}\';" style=" max-width: 128px; "></a></div>';
tpl_height += '<div class="text"><table><tbody><tr><td>';
tpl_height += '<a href="{str_url}">{str_date} <span style="color:#737373;">{str_time}</span></a>';
tpl_height += '</td></tr><tr><td class="tname">';
tpl_height += '<a href="{str_url}">{str_title}</a>';
tpl_height += '</td></tr></tbody></table></div></div></div>';

var video_tpl = '<video id="video_play" src="{tpl_url}" controls autoplay width="620" height="348" ></video>';

var team_host = '';
var team_guest = '';

function json2string(json) {
    return JSON.stringify(json).replace(',', ', ').replace('[', '').replace(']', '');
}

/**	function used */
function getUrlParameters(parameter, staticURL, decode) {
    /*
	    Function: getUrlParameters
	    Description: Get the value of URL parameters either from 
	                 current URL or static URL
	    Author: Tirumal
	    URL: www.code-tricks.com
	   */
    var currLocation = (staticURL.length) ? staticURL : window.location.search,
        parArr = currLocation.split("?")[1].split("&"),
        returnBool = true;

    for (var i = 0; i < parArr.length; i++) {
        parr = parArr[i].split("=");
        if (parr[0] == parameter) {
            return (decode) ? decodeURIComponent(parr[1]) : parr[1];
            returnBool = true;
        } else {
            returnBool = false;
        }
    }

    if (!returnBool) return false;
}

function vod_title_marquee(self, speeds, wdith, height){
	
	speeds = typeof(speeds)!='undefined' &&  /^[0-9]+$/.test(speeds)  ? speeds : 10000 ;
	wdith = typeof(wdith)!='undefined' &&  /^[0-9]+$/.test(wdith)  ? wdith : 170 ;
	height = typeof(height)!='undefined' &&  /^[0-9]+$/.test(height)  ? height : 20 ;
	
	if (typeof($('.pv-title', self).html())!='undefined'){
		//$('#jmarquee_title', self).css({'overflow':'visible'});
		$('.pv-title', self).html('<div id="_item">' + $('.pv-title', self).html() + '</div>');
		var _item = $('#_item', self);
		if ( (_item.height()/height)>1 ){
			_item.css({
				'position' : 'relative'
			}).width( Math.ceil( _item.height()/height*wdith ) );
			while(true){
				_item.width( _item.width() - 10 );
				if ( _item.height()/height >=2 ) break;
			}
			_item.width( _item.width() + 10 );
		 	$('.pv-img', self).hover(function(){
				_item.animate({	
					left: "-=" + _item.width()
				}, 10000, function() {
					// Animation complete.
					_item.css({'left': '0'});
				});
		 	},
		 	function(){
				_item.css({'left': '0'}).stop();
		 	});			
		}
	}	
	
	
}


var cpbl = {
    init: function () {}
};

$(function () {
    //	site.init();
});