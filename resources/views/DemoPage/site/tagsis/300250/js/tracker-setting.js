var tracker = new Tracker('thenewslens',[["nav-share-click",".nav-container .progress-share *, .nav-container .progress-share"],["nav-next-click",".nav-container .progress-next *, .nav-container .progress-next"],["menu-click",".menu-btn"],["article_share_fb_btn",".social-btns a .fa-facebook-square","article"],["article_share_twitter_btn",".social-btns a .fa-twitter-square","article"],["article_share_google_btn",".social-btns a .fa-google-plus-square","article"],["article_share_line_btn",".social-btns a .icon-line-square","article"],["article_share_linkedin_btn",".social-btns a .fa-linkedin-square","article"],["article_share_email_btn",".social-btns a .fa-envelope-square","article"],["recommend_block_click",".bottom-recommend .img-box div, .bottom-recommend .img-box div *, .bottom-recommend h3 a","",function(dom){    var data = {};    data.r_type = dom.dataset.recommendType;    data.r_order = dom.dataset.order;    data.r_id = dom.dataset.recommendId;    data.id = dom.dataset.postId;    data.layout = dom.dataset.layout;    return data;}],["recommend_click",".bottom-recommend .img-box div, .bottom-recommend .img-box div *, .bottom-recommend h3 a","",function(dom){    var data = {};    data.subname = dom.dataset.order;    data.r_type = dom.dataset.recommendType;    data.r_id = dom.dataset.recommendId;    data.id = dom.dataset.postId;    data.layout = dom.dataset.layout;    if(typeof dom.dataset.abTestSlug != 'undefined') data.ab_slug = dom.dataset.abTestSlug;    return data;}],["recommend_block_click",".top-recommend .img-box div, .top-recommend .img-box div *, .top-recommend h3 a","",function(dom){    var data = {};    data.r_type = dom.dataset.recommendType;    data.r_order = dom.dataset.order;    data.r_id = dom.dataset.recommendId;    data.id = dom.dataset.postId;    data.layout = dom.dataset.layout;    return data;}],["recommend_click",".top-recommend .img-box div, .top-recommend .img-box div *, .top-recommend h3 a","",function(dom){    var data = {};    data.subname = dom.dataset.order;    data.r_type = dom.dataset.recommendType;    data.r_id = dom.dataset.recommendId;    data.id = dom.dataset.postId;    data.layout = dom.dataset.layout;    if(typeof dom.dataset.abTestSlug != 'undefined') data.ab_slug = dom.dataset.abTestSlug;    return data;}],["core_reader_survey_click",".vip-member-quiz-2017-link, .vip-member-quiz-2017-link *"],["aids_start",".aids-event-201711 #event-lgbt-start #startDiv, .aids-event-201711 #event-lgbt-start #startDiv *"],["aids_share",".aids-event-201711 #event-lgbt-q #shareme, .aids-event-201711 #event-lgbt-q #shareme *"],["aids_interaction",".aids-event-201711 .evnet-lgbt-anslist","",function(dom){    var data = {};    data.q_id = dom.dataset.qnum;    data.correct = dom.dataset.ans;    data.item = dom.innerText;    return data;}],["aids_to_article",".aids-article, .aids-article *"],["aids_banner_to_game","#aids-banner *"],["aids_link_to_game","#aids-link"],["aids_link_to_game_1","#aids-link-1"],["gdpr-accept-click","#cookie-accept"],["gdpr-close-click",".cookie-close"],],[],[["new-article-section-imp",".article-section .first-section .index-main-box"],["hot-section-imp",".hot-section"],["video-section-imp",".video-section"],["project-section-imp",".project-section"],["cooperate-blog-imp",".corporateblog-section"],["old-article-section-imp","#other"],["footer-imp",".footer-wrap"],["infinite-article-1-imp",".article-zone[data-order=\"1\"] .article-body-container"],["infinite-article-2-imp",".article-zone[data-order=\"2\"] .article-body-container"],["infinite-article-3-imp",".article-zone[data-order=\"3\"] .article-body-container"],["infinite-article-4-imp",".article-zone[data-order=\"4\"] .article-body-container"],["infinite-article-5-imp",".article-zone[data-order=\"5\"] .article-body-container"],["infinite-article-6-imp",".article-zone[data-order=\"6\"] .article-body-container"],["recommend_block_imp",".bottom-recommend","",function(dom){    var data = {};    data.r_type = dom.dataset.recommendType;    data.id = dom.dataset.postId;    data.layout = dom.dataset.layout;    return data;}],["recommend_imp",".bottom-recommend .img-box div, .bottom-recommend .img-box div *, .bottom-recommend h3 a","",function(dom){    var data = {};    data.subname = dom.dataset.order;    data.r_type = dom.dataset.recommendType;    data.r_id = dom.dataset.recommendId;    data.id = dom.dataset.postId;    data.layout = dom.dataset.layout;    if(typeof dom.dataset.abTestSlug != 'undefined') data.ab_slug = dom.dataset.abTestSlug;    return data;}],["recommend_block_imp",".top-recommend","",function(dom){    var data = {};    data.r_type = dom.dataset.recommendType;    data.id = dom.dataset.postId;    data.layout = dom.dataset.layout;    return data;}],["recommend_imp",".top-recommend .img-box div, .top-recommend .img-box div *, .top-recommend h3 a","",function(dom){    var data = {};    data.subname = dom.dataset.order;    data.r_type = dom.dataset.recommendType;    data.r_id = dom.dataset.recommendId;    data.id = dom.dataset.postId;    data.layout = dom.dataset.layout;    if(typeof dom.dataset.abTestSlug != 'undefined') data.ab_slug = dom.dataset.abTestSlug;    return data;}],["core_reader_survey",".vip-member-quiz-2017"],["gdpr-imp",".cookie-zone"],]); tracker.start();