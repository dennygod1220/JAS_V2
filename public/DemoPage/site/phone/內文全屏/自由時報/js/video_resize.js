function video_resize(parent) {
    if ($(parent + ' iframe').length > 0) {
        $(parent).find('iframe').each(function() {
            var video_src = $(this).attr('src');
            if (typeof(video_src) !== 'undefined') {
                if (video_src.match('facebook.com/plugins/video.php') != null) {
                    var origin_width = $(this).attr('width');
                    var origin_height = $(this).attr('height');
                    var m_width = $(this).parent().width();
                    var m_height;
                    if (origin_width > origin_height) {
                        m_height = m_width / 1.7777;
                    } else {
                        m_height = m_width * (origin_height / origin_width);
                    }
                    $(this).height(m_height);
                    $(this).width(m_width);
                }
                if (video_src.match('youtube.com') != null) {
                    var width = $(this).width();
                    m_width = $(this).parents('p').width();
                    set_height = m_width / 1.7777;
                    $(this).height(set_height);
                    $(this).width(m_width);
                }
                if (video_src.match('facebook.com/plugins/post.php') != null) {
                    // 父元素寬度
                    var parent_width = $(this).parents('p').width();
                    var url = decodeURIComponent(video_src);

                    // 使用SDK重新載入貼文(小於340px時寬度會超出螢幕)
                    var regex = (url.match(/story_fbid=\d+&id=\d+/g) != null) ?
                        /.*story_fbid=\d+&id=\d+.*/g :
                        /.*href=.*facebook.*\/([^\/]+)\/(posts|photos\/[^\/]+)\/(\d+).*/g;
                    var subst = '<div class="fb-post" data-href="https://www.facebook.com/$1/posts/$3/" data-width="' + parent_width + '"></div>';
                    var result = url.replace(regex, subst);

                    $(this).after(result);
                    $(this).remove();
                }
            }
        });
    }
}

// 載入FB SDK
window.fbAsyncInit = function() {
    FB.init({
      xfbml      : true,
      version    : 'v2.12'
    });
};
(function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
