function getScrNews(channel, type, group, no)
{
    var a = window.screen.width,
        b = window.screen.height,
        c = (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth),
        d = (window.innerHeight || document.documentElement.clientHeight|| document.body.clientHeight),
        e = get_referrer(),
        f = encodeURIComponent(document.URL),
        g = encodeURIComponent(document.title),
        h = channel,
        i = type,
        j = (group == 'undefined') ? '' : group,
        k = (no == 'undefined') ? '' : no,
        l = navigator.cookieEnabled,
        m=(ad_block_check) ? 'A' : 'B';

    var tt = (new Date()).getTime();

    var s = document.createElement("script");
    s.async = true;
    s.onload = function(){
        send_onead_data();
    };
    s.src = '//'+pvServer+"/RI_Server?a="+a+"&b="+b+
            "&c="+c+"&d="+d+"&e="+e+"&f="+f+"&g="+g+"&h="+h+"&i="+i+"&j="+j+"&k="+k+"&l="+l+"&m="+m+'&tt='+tt;
    var el = document.getElementsByTagName("script")[0];
    el.parentNode.insertBefore(s, el);

    send_onead_data();

    function get_referrer(){
        var ref = ltncookies("ltn_referrer");
        ltncookies("ltn_referrer", "", -100);
        if(ref==""){ ref = document.referrer; }
        if(ref==""){ return ""; }
        return encodeURIComponent(ref);
    }
}

// 將數值存入 cookie
function ltncookies(key, value, time_sec){
    if (arguments.length > 1) {
        var cv  = encode(key)+'='+encode(value);
            cv += ';domain=.ltn.com.tw';
            cv += ';path=/';

        if(time_sec){
            var s = new Date();
            var e = new Date((s.getTime()+time_sec*1000));
            cv += ';expires='+e.toUTCString();
        }
        cv += ';domain=.ltn.com.tw';
        cv += ';path=/';
        document.cookie = cv;
    }else{
        var _key    = encode(''||key);
        var cookies = document.cookie ? document.cookie.split('; ') : [];
        var res     = '';

        for (var i  = 0, l = cookies.length; i < l; i++) {

            var parts  = cookies[i].split('=');
            var name   = parts.shift();
            var cookie = parts.join('=');
            if (_key === name) {
                res = cookie;
                break;
            }
        }

        return res;
    }

    function encode(s) {
        return encodeURIComponent(s);
    }

    function decode(s) {
        return decodeURIComponent(s);
    }
};


var onead_pixel = onead_pixel || [];
var send_onead_data_run = false;


function web_open(){

    return true;

    /*
    if(
        location.hostname=='news.ltn.com.tw'
        || location.hostname=='www.ltn.com.tw'
    ){
        return true;
    }
    return false;
    */
}

function send_onead_data()
{

    if(!web_open()) return;

    //如果沒有GUID, 不執行, 等待script.onload
    var sessionid = ltncookies('ReaderInfo');
    if(sessionid=="") return;

    //觸發點有二個, 限定只執行一次
    if(send_onead_data_run) return;
    send_onead_data_run = true;

    var category = pv_get_site_cate();

    console.log("sessionid: "+sessionid);
    console.log("category: "+category);

    onead_pixel.push({
        uid: "1000054",
        sessionid: sessionid,
        accountid: "",
        category: category
    });

    var s = document.createElement("script"), el = document.getElementsByTagName("script")[0]; s.async = true;
    s.src = (document.location.protocol === "https:" ? "https:" : "http:") + "//ad-specs.guoshipartners.com/static/js/onead-pixel.min.js?_t=" + Math.floor((new Date).getTime() / 300000);
    el.parentNode.insertBefore(s, el);
}

var ad_block_check = true;
(function(){

    var s = document.createElement("script")
    var el = document.getElementsByTagName("script")[0];
    s.src = "//pv.ltn.com.tw/google_ad_block_check.js?_t=" + Math.floor((new Date).getTime() / 300000);
    el.parentNode.insertBefore(s, el);

})();

function pv_get_site_cate()
{
    var c = location.hostname.replace('.ltn.com.tw', '');
    var m = '';
    try {
        m = document.getElementsByName('ltn:device')[0].content;
        if(m!="M") m="";
        if(m=="M") m="m";
    }catch(err){
    }

    switch (c.toLowerCase()) {
        case 'talk':
        case 'istyle':
        case 'ent':
        case '3c':
        case 'auto':
        case 'fun':
        case 'sports':
        case 'food':
            return m + c + '';
            break;
        case 'news':
        case 'm':
            if((/^\/news\//).test(location.pathname) || (/^\/section\//).test(location.pathname)){
                return m+location.pathname.split("/")[2];
            }else{
                return m + 'news' + '';
            }
            break;
        case 'www':
            return m + 'news' + '';
            break;
        default:
            return m+'other';
    }
};

function SetLTNTag(){

    var ck = new cookies_admin_mode("ltnTag");
    var s = ck.read() || "";
    if(s==""){
        console.log("NO TAG");
        return;
    }

    var k = [];
    var pubads = googletag.pubads();
    for(var $i=0;$i<s.length;$i++){
        var f = s.substr($i,1);
        if($i==0){
            pubads.setTargeting("LTN01", [f]);
        }else if($i==1){
            pubads.setTargeting("LTN02", [f]);
        }else if(f=="1"){
            k.push($i-1);
        }
    }
    pubads.setTargeting("LTN03", k);
}

(function(){

    var tryTime = 25;
    var time = setInterval(function(){
        if((typeof googletag)=='object' && (typeof googletag.cmd)=='object'){
            clearInterval(time);
            console.log("OK");
            try{
                googletag.cmd.push(function(){
                    SetLTNTag();
                });
            }catch(e){
                console.log(e);
            }
        }else if(tryTime<0){
            clearInterval(time);
            console.log("TRY");
        }else{
            console.log("NG");
        }
        tryTime--;
    }, 50);

})();

function getShare(channel, type, title)
{
    var a = window.screen.width,
        b = window.screen.height,
        c = (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth),
        d = (window.innerHeight || document.documentElement.clientHeight|| document.body.clientHeight),
        e = document.referrer,
        f = encodeURIComponent(document.URL),
        g = encodeURIComponent(title),
        h = channel,
        i = type,
        j = (group == 'undefined') ? '' : group,
        k = (no == 'undefined') ? '' : no,
        l = navigator.cookieEnabled,
        m=(ad_block_check) ? 'A' : 'B';

    var s = document.createElement("script");
    s.async = true;

    s.src = '//'+pvServer+"/RI_Server?a="+a+"&b="+b+
            "&c="+c+"&d="+d+"&e="+e+"&f="+f+"&g="+g+"&h="+h+"&i="+i+"&j="+j+"&k="+k+"&l="+l+"&m="+m;
    var el = document.getElementsByTagName("script")[0];
    el.parentNode.insertBefore(s, el);

}
